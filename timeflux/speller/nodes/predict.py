import json
import numpy as np
from time import time
from datetime import datetime
from timeflux.core.node import Node
from timeflux.helpers.port import match_events, make_event


class Best(Node):

    def __init__(self):
        self.ready = False
        self.time = datetime.fromtimestamp(0)

    def update(self):
        # Loop through the UI events
        if self.i_ui.ready():
            for timestamp, row in self.i_ui.data.iterrows():

                # Save character list and initialize
                if row.label == "session_begins":
                    setup = json.loads(row.data)
                    self.chars = setup["symbols"]

                # Ready to roll
                elif row.label == "testing_begins":
                    self.ready = True

                # Start a new block and reset scores
                elif row.label == "block_begins":
                    if self.ready:
                        self._reset()

                # Record latest flash timestamp
                elif row.label == "flash_begins":
                    if self.ready:
                        self.onset = timestamp

                # Block ends
                elif row.label == "block_ends":
                    if self.ready:
                        self.time = self.onset
                        break

        # Loop through the model events
        if self.i_model.ready():
            if "epochs" in self.i_model.meta:
                meta = self.i_model.meta["epochs"]
            for timestamp, row in self.i_model.data.iterrows():

                # Check if the model is fitted and forward the event
                if row.label == "ready":
                    self.o.data = make_event("ready", serialize=False)

                # Match flashes and epochs, and update probabilities
                elif row.label == "predict_proba":
                    if self.ready:
                        info = meta.pop(0)["epoch"]
                        group = info["context"]["group"]
                        onset = info["onset"]
                        proba = json.loads(row["data"])["result"]
                        self._update(proba, group)
                        if onset == self.time:
                            char = self.chars[self.scores.index(max(self.scores))]
                            self.o.data = make_event("predict", {"target": char}, False)
                            self.logger.debug(f"Scores:\n{self.scores}")
                            self.logger.debug(f"Predicted: {char}")
                            break

    def _update(self, proba, group):
        for i in group:
            self.scores[i] += proba[1]

    def _reset(self):
        self.scores = [0] * len(self.chars)



class InferBlock(Node):

    def __init__(self):
        self.ready = False
        self.time = datetime.fromtimestamp(0)

    def update(self):
        # Loop through the UI events
        if self.i_ui.ready():
            for timestamp, row in self.i_ui.data.iterrows():

                # Save character list and initialize
                if row.label == "session_begins":
                    setup = json.loads(row.data)
                    self.chars = setup["symbols"]
                    self._init(setup)

                # Ready to roll
                elif row.label == "testing_begins":
                    self.ready = True

                # Start a new block and reset scores
                elif row.label == "block_begins":
                    if self.ready:
                        self._reset()

                # Record latest flash timestamp
                elif row.label == "flash_begins":
                    if self.ready:
                        self.onset = timestamp

                # Block ends
                elif row.label == "block_ends":
                    if self.ready:
                        self.time = self.onset
                        break

        # Loop through the model events
        if self.i_model.ready():
            if "epochs" in self.i_model.meta:
                meta = self.i_model.meta["epochs"]
            for timestamp, row in self.i_model.data.iterrows():

                # Check if the model is fitted and forward the event
                if row.label == "ready":
                    self.o.data = make_event("ready", serialize=False)

                # Match flashes and epochs, and update probabilities
                elif row.label == "predict_proba":
                    if self.ready:
                        info = meta.pop(0)["epoch"]
                        group = info["context"]["group"]
                        onset = info["onset"]
                        proba = json.loads(row["data"])["result"]
                        self._update(proba, group)
                        if onset == self.time:
                            max = np.amax(self.scores)
                            char = self.chars[np.where(self.scores == max)[0][0]]
                            self.o.data = make_event("predict", {"target": char}, False)
                            self.logger.debug(f"Scores:\n{self.scores}")
                            self.logger.debug(f"Predicted: {char}")
                            break

    def _init(self, setup):
        self.infer = CumP300Classifier(len(self.chars))

    def _update(self, proba, group):
        mask = np.zeros(len(self.chars))
        for char in group:
            mask[char] = 1
        self.scores = self.infer.predict_proba(proba, mask)

    def _reset(self):
        self.infer.reset()


class InferContinuous(Node):

    def __init__(self, threshold=3):
        self.threshold = threshold
        self.ready = False

    def update(self):

        # Loop through the UI events
        if self.i_ui.ready():
            for timestamp, row in self.i_ui.data.iterrows():

                # Save character list and initialize
                if row.label == "session_begins":
                    setup = json.loads(row.data)
                    self.chars = setup["symbols"]
                    self._init(setup)

                # Start a new block
                elif row.label == "block_begins":
                    if self.ready:
                        self.time = timestamp

        # Loop through the model events
        if self.i_model.ready():
            if "epochs" in self.i_model.meta:
                meta = self.i_model.meta["epochs"]
            for timestamp, row in self.i_model.data.iterrows():

                # Check if the model is fitted and forward the event
                if row.label == "ready":
                    self.ready = True
                    #self.fitted = True
                    self.o.data = make_event("ready", serialize=False)

                # Match flashes and epochs, and update probabilities
                elif row.label == "predict_proba":
                    if self.ready and timestamp > self.time:
                        proba = json.loads(row["data"])["result"]
                        group = meta.pop(0)["epoch"]["context"]["group"]
                        self._update(proba, group)
                        indices = np.flip(np.argsort(self.scores))
                        if self.scores[indices[0]] / self.scores[indices[1]] >= self.threshold:
                            char = self.chars[indices[0]]
                            self.o.data = make_event("predict", {"target": char}, False)
                            self.logger.debug(f"Scores:\n{self.scores}")
                            self.logger.debug(f"Predicted: {char}")
                            self._reset()

    def _init(self, setup):
        self.infer = CumP300Classifier(len(self.chars))

    def _update(self, proba, group):
        mask = np.zeros(len(self.chars))
        for char in group:
            mask[char] = 1
        self.scores = self.infer.predict_proba(proba, mask)

    def _reset(self):
        self.infer.reset()
        self.time = datetime.fromtimestamp(time() + (3600 * 24))


class CumP300Classifier():

    """Classification of characters of the P300-speller,
    using a cumulative-trial MAP based classifier, processing target and
    non-target responses to the flash and giving a probability after each flash.

    Parameters
    ----------
    n_characters : int, (default 36)
        The number of characters flashed in the interface.
    class_prior : list, (default None)
        The prior probability on characters.
    """

    def __init__(self, n_characters, character_prior=None):
        self.n_characters = n_characters

        self.reset(character_prior)

    def reset(self, character_prior=None):
        """Reset the probabilities of characters.
        It must be called at the beginning of each group of flashes.

        Parameters
        ----------
        class_prior : list, (default None)
            The prior probability on characters.

        Returns
        -------
        self : CumP300Classifier instance
            The CumP300Classifier instance.
        """
        if character_prior is None:
            self.character_prior = np.ones(self.n_characters)
        else:
            if len(character_prior) != self.n_characters:
                raise ValueError("Length of character_prior is different from n_characters")
            self.character_prior = np.asarray(character_prior)
        self.character_prior /= self.character_prior.sum()

        self.character_proba = self.character_prior.copy()

        return self


    def predict_proba(self, erp_likelihood, character_flash):
        """Predict probability of each character after a new trial.

        Parameters
        ----------
        erp_likelihood : array-like, shape (2,)
            array-like containing the likelihoods of ERP (non-target and target
            responses) on this new trial.
        character_flash : array-like, shape (n_characters,)
            array-like containing 1 is the character has been flashed during
            this trial, 0 otherwise.

        Returns
        -------
        character_proba : ndarray, shape (n_characters,)
            probability for each character cumulated across trials.
        """
        if len(erp_likelihood) != 2:
            raise ValueError("erp_likelihood must contain 2 values")

        for c in range(self.n_characters):
            if character_flash[c] == 1:
                # character c has been flashed: likelihood is the distance to
                # the target response
                likelihood = erp_likelihood[1]
            elif character_flash[c] == 0:
                # character c has not been flashed: likelihood is the distance
                # to the non-target response
                likelihood = erp_likelihood[0]
            else:
                raise ValueError("character_flash must contain only binary numbers")

            self.character_proba[c] *= likelihood

        sum =  self.character_proba.sum()
        if sum == 0:
            # Just in case
            sum = self.n_characters
            self.reset()

        character_proba = self.character_proba / sum

        return character_proba


