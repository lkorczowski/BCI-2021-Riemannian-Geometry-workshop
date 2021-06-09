'use strict';

load_settings().then(settings => {

    let speller = new Speller(settings.speller);
    speller.io.subscribe('model');
    speller.io.on('model', on_model);

    let instructions = document.getElementById('instructions');
    let button = document.getElementById('button');
    button.addEventListener('click', on_click);

    async function on_click() {
        switch (speller.status) {
            case 'ready':
                button.disabled = true;
                await speller.train();
                button.innerHTML = 'Start';
                instructions.innerHTML = 'Please wait while the model is fitting.';
                break;
            case 'idle':
                instructions.innerHTML = '';
                button.innerHTML = 'Stop';
                await speller.test();
                button.innerHTML = 'Start';
                button.disabled = false;
                break;
            case 'testing':
                button.disabled = true;
                speller.stop();
                break;
        }
    }

    function on_model(data, meta) {
        for (let row of Object.values(data)) {
            switch (row.label) {
                case 'ready':
                    if (speller.status == 'idle') {
                        instructions.innerHTML = '';
                        button.disabled = false;
                    }
                    break;
                case 'predict':
                    if (speller.status == 'testing') {
                        let feedback = instructions.innerHTML + row.data.target;
                        feedback = feedback.substring(feedback.length - 30, feedback.length)
                        instructions.innerHTML = feedback;
                        speller.predict(row.data.target);
                    }
                    break;
            }
        }
    }

    speller.on('baseline-eyes-open_begins', () => {
        instructions.innerHTML = 'Please keep your eyes <b>open</b> and try not to move.';
    });
    speller.on('baseline-eyes-closed_begins', () => {
        instructions.innerHTML = 'Please <b>close</b> your eyes and try not to move.';
    });
    speller.on('focus_begins', (target) => {
        instructions.innerHTML = 'Focus on: <b>' + target + '</b>';
    });
    speller.on('training_ends', () => {
        instructions.innerHTML = '';
    });

});
