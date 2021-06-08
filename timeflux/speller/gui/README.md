# A P300 speller demo

## Events sent to stream ``events``

Label                           | Data
------------------------------- | ----
``session_begins``              | ``<object> ``
``calibration_begins``          | ``null``
``baseline-eyes-open_begins``   | ``null``
``baseline-eyes-open_ends``     | ``null``
``baseline-eyes-closed_begins`` | ``null``
``baseline-eyes-closed_ends``   | ``null``
``training_begins``             | ``{ "targets": <string> }``
``focus_begins``                | ``{ "target": <char> }``
``focus_ends``                  | ``null``
``block_begins``                | ``{ "target": <char\|null> }``
``round_begins``                | ``null``
``flash_begins``                | ``{ "group": <array>, "includes_target": <bool\|null> }``
``flash_ends``                  | ``null``
``round_ends``                  | ``null``
``block_ends``                  | ``null``
``training_ends``               | ``null``
``calibration_ends``            | ``null``
``testing_begins``              | ``null``
``testing_ends``                | ``null``
``session_ends``                | ``null``

## Events received from stream ``model``

Label                    | Data
------------------------ | ----
``ready``                | ``null``
``predict``              | ``{ "target": <char> }``