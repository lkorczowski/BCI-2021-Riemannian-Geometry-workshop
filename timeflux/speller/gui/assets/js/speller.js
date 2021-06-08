/**
 * @file P300 Speller
 * @author Pierre Clisson <pierre@clisson.net>
 */

'use strict';


/**
 * A simple P300 speller
 *
 * @see: Riemannian Minimum Distance to Mean Classifier for P300 BCI data: the non-adaptive mode
 *
 * @mixes Dispatcher
 */
class Speller {

    /**
     * @param {Object} [options]
     * @param {string} [options.symbols] - list of characters available for the speller
     * @param {string} [options.targets] - list of characters used for training
     * @param {number} [options.groups] - number of groups (0 means automatic)
     * @param {Object} [options.repetitions]
     * @param {number} [options.repetitions.train] - number of rounds in a block in train mode
     * @param {number} [options.repetitions.test] - number of rounds in a block in test mode (0 means infinite)
     * @param {Object} [options.grid]
     * @param {HTMLElement} [options.grid.element] - grid container DOM node
     * @param {number} [options.grid.columns] - number of columns in the grid
     * @param {string} [options.grid.ratio] - grid aspect ratio (examples: '1:1', '16:9', empty string means 100% width and 100% height)
     * @param {boolean} [options.grid.borders] - if the borders must be drawn
     * @param {Object} [options.classes]
     * @param {string} [options.classes.symbol] - CSS class prefix used for grid items
     * @param {string} [options.classes.focus] - CSS class to apply on focus
     * @param {string} [options.classes.flash] - CSS class to apply on flash
     * @param {Object} [options.stim]
     * @param {boolean} [options.stim.face] - show a smiley face on flash
     * @param {boolean} [options.stim.magnify] - magnify the symbol on flash
     * @param {Object} [options.durations]
     * @param {number} [options.durations.baseline_eyes_open] - milliseconds
     * @param {number} [options.durations.baseline_eyes_closed] - milliseconds
     * @param {number} [options.durations.focus] - milliseconds
     * @param {number} [options.durations.inter_block] - milliseconds
     * @param {number} [options.durations.flash] - milliseconds (from exponential distribution)
     * @param {number} [options.durations.flash.expectation] - milliseconds
     * @param {number} [options.durations.flash.min] - milliseconds
     * @param {number} [options.durations.flash.max] - milliseconds
     * @param {number} [options.durations.inter_flash] - milliseconds (from exponential distribution)
     * @param {number} [options.durations.inter_flash.expectation] - milliseconds
     * @param {number} [options.durations.inter_flash.min] - milliseconds
     * @param {number} [options.durations.inter_flash.max] - milliseconds
     */
    constructor(options = {}) {
        let default_options = {
            symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
            targets: 'TIMEFLUX',
            groups: 0,
            repetitions: {
                train: 8,
                test: 6
            },
            grid: {
                element: document.getElementById('symbols'),
                columns: 6,
                ratio: '',
                borders: true
            },
            classes: {
                symbol: 'symbol',
                focus: 'focus',
                flash: 'flash'
            },
            stim: {
                face: false,
                magnify: true
            },
            durations: {
                baseline_eyes_open: 30000,
                baseline_eyes_closed: 30000,
                focus: 750,
                inter_block: 2000,
                flash: {
                    expectation: 80,
                    min: 60,
                    max: 160
                },
                inter_flash: {
                    expectation: 120,
                    min: 80,
                    max: 300
                }
            },

        };
        this.options = merge(default_options, options);
        this.beep = new Audio('assets/wav/click.mp3');
        this.io = new IO();
        if (this.options.groups == 0) {
            this.options.groups = Math.round(Math.sqrt(this.options.symbols.length));
        }
        this._make_grid();
        this.status = 'ready';
        this.io.on('connect', () => this.io.event('session_begins', this.options));
        window.onbeforeunload = () => {
            this.io.event('session_ends');
        }
        this.scheduler = new Scheduler();
        this.scheduler.start();
    }

    /**
     * Add symbols to the grid
     */
    _make_grid() {
        this.options.grid.element.style.gridTemplateColumns = 'repeat(' + this.options.grid.columns + ', 1fr)';
        for (let i in this.options.symbols) {
            let  symbol = document.createElement('div');
            symbol.className = this.options.classes.symbol;
            symbol.id = this.options.classes.symbol + '_' + i;
            symbol.textContent = this.options.symbols[i];
            this.options.grid.element.appendChild(symbol);
        }
        if (!this.options.grid.borders) set_css_var('--grid-border-size', '0');
        this._resize();
        window.onresize = this._resize.bind(this);
    }

    /**
     * Adjust font size relatively to the window size
     */
    _resize() {
        // Reset
        set_css_var('--grid-width', '100%');
        set_css_var('--grid-height', '100%');
        set_css_var('--grid-padding', '0');
        set_css_var('--font-size-normal', '0px');
        set_css_var('--font-size-flash', '0px');
        set_css_var('--font-size-focus', '0px');
        // Compute sizes
        let columns = this.options.grid.columns;
        let rows = Math.ceil(this.options.symbols.length / columns);
        let grid_width = this.options.grid.element.clientWidth;
        let grid_height = this.options.grid.element.clientHeight;
        let grid_padding = 0;
        if (this.options.grid.ratio) {
            let ratio = this.options.grid.ratio.split(':');
            if (ratio[0] * grid_height >= grid_width * ratio[1]) {
                let height = (ratio[1] * grid_width) / ratio[0];
                grid_padding = (grid_height - height) / 2 + "px 0";
                grid_height = height;

            } else {
                let width = (ratio[0] * grid_height) / ratio[1];
                grid_padding = "0 " + (grid_width - width) / 2 + "px";
                grid_width = width;
            }
        }
        let cell_width = grid_width / columns;
        let cell_height = grid_height / rows;
        let cell_size  = (cell_width > cell_height) ? cell_height : cell_width;
        let cell_size_off = Math.ceil(cell_size * .5);
        let cell_size_on = this.options.stim.magnify ? Math.ceil(cell_size * .80) : cell_size_off;
        // Adjust
        set_css_var('--grid-width', grid_width + 'px');
        set_css_var('--grid-height', grid_height + 'px');
        set_css_var('--grid-padding', grid_padding);
        set_css_var('--font-size-normal',  cell_size_off + 'px');
        set_css_var('--font-size-flash', cell_size_on + 'px');
        set_css_var('--font-size-focus', cell_size_on + 'px');
    }

    /**
     * Create random groups
     */
    _make_groups() {
        // Initialize groups
        this.groups = Array.from({length: this.options.groups}, () => []);
        // Randomize symbols
        let symbols = Array.from(Array(this.options.symbols.length).keys());
        this._shuffle(symbols);
        // Initialize group assignments
        let groups = []
        for (const i of symbols) {
            if (groups.length == 0) {
                // Randomize assignments
                groups = Array.from(Array(this.options.groups).keys());
                this._shuffle(groups);
            }
            // Assign symbol to group
            this.groups[groups.shift()].push(i);
        }
    }

    /*
     * Draw a random number from an exponential distribution
     *
     * @see: https://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
     *
     * @param {number} [λ] - rate
     * @returns {number}
     */
    _rand_exponential(λ = 1) {
        return -Math.log(Math.random()) / λ;
    }

    /**
     * Draw a constrained random number from an exponential distribution
     *
     * @returns {number}
     */
    _rand_range(expectation, min, max) {
        while (true) {
            let v = this._rand_exponential() * expectation;
            if (v >= min && v <= max) return v;
        }
    }

    /**
     * Shuffle an array
     *
     * This is done in-place. Make a copy first with .slice(0) if you don't want to
     * modify the original array.
     *
     * @param {array} array
     *
     * @see:https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
     */
    _shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Check if a prediction has been received or if the stop button has been pressed
     *
     * @returns {boolean}
     */
    _interrupt() {
        if (this.status == 'testing' && this.target != null) return true;
        if (this.status == 'idle') return true;
    }

    /**
     * Briefly focus on a symbol
     *
     * @param {number} symbol
     */
    async focus(symbol, duration) {
        let element = document.getElementById('symbol_' + symbol);
        element.classList.add(this.options.classes.focus);
        //this.beep.play();
        speak(this.options.symbols[symbol]);
        await sleep(duration);
        element.classList.remove(this.options.classes.focus);
    }

    /**
     * Flash a group
     *
     * @param {array} group
     */
    async flash(group, duration) {
        let elements = {};
        await this.scheduler.asap(() => {
            for (let symbol of group) {
                let element = document.getElementById('symbol_' + symbol);
                elements[this.options.symbols[symbol]] = element;
                element.classList.add(this.options.classes.flash);
                if (this.options.stim.face) element.innerHTML = "&#9787;";
            }
            let includes_target = this.status == 'testing' ? null : group.includes(this.target);
            this.io.event('flash_begins', { group: group, includes_target: includes_target });
        });
        await sleep(duration);
        await this.scheduler.asap(() => {
            for (const [symbol, element] of Object.entries(elements)) {
                element.classList.remove(this.options.classes.flash);
                if (this.options.stim.face) element.innerHTML = symbol;
            }
            this.io.event('flash_ends');
        });
    }

    /**
     * Create random groups and flash each group
     */
    async round() {
        // Randomize groups
        this._make_groups();
        // Flash and wait
        this.io.event('round_begins', {groups: this.groups});
        for (let group of this.groups) {
            if (this._interrupt()) break;
            await this.flash(group, this._rand_range(
                this.options.durations.flash.expectation,
                this.options.durations.flash.min,
                this.options.durations.flash.max
            ));
            await sleep(this._rand_range(
                this.options.durations.inter_flash.expectation,
                this.options.durations.inter_flash.min,
                this.options.durations.inter_flash.max
            ));
        }
        this.io.event('round_ends');
    }

    /**
     * Repeat round
     *
     * @param {number} repetitions
     */
    async block(repetitions) {
        for (let i = 0; i < repetitions; i++) {
            await this.round();
        }
    }

    /**
     * Enter the main testing loop
     *
     * @param {number} repetitions per block
     */
    async loop(repetitions) {
        this.io.event('block_begins', { target: null });
        if (repetitions == 0) {
            // Repeat round until a prediction is received
            while (!this._interrupt()) await this.round();
            this.io.event('block_ends');
        } else {
            // Do a full block and wait for a prediction
            await this.block(this.options.repetitions.test);
            this.io.event('block_ends');
            while (!this._interrupt()) await sleep(50);
        }
        if (this.target != null) {
            // We got a prediction
            await this.focus(this.target, this.options.durations.focus);
            this.target = null;
        }
    }

    /**
     * Start training
     *
     * @param {string} [targets]
     */
    async train(targets) {
        if (targets === undefined) targets = this.options.targets;
        this.io.event('calibration_begins');
        this.status = 'calibrating';
        targets = targets.toUpperCase();
        if (this.options.durations.baseline_eyes_open > 0) {
            this.beep.play();
            //speak("Please keep your eyes open");
            this.trigger('baseline-eyes-open_begins');
            this.io.event('baseline-eyes-open_begins');
            await sleep(this.options.durations.baseline_eyes_open);
            this.io.event('baseline-eyes-open_ends');
        }
        if (this.options.durations.baseline_eyes_closed > 0) {
            this.beep.play();
            //speak("Please close your eyes");
            this.trigger('baseline-eyes-closed_begins');
            this.io.event('baseline-eyes-closed_begins');
            await sleep(this.options.durations.baseline_eyes_closed);
            this.io.event('baseline-eyes-closed_ends');
        }
        //this.beep.play();
        this.io.event('training_begins', { targets: targets });
        for (let target of targets) {
            this.target = this.options.symbols.indexOf(target);
            //this.beep.play();
            this.trigger('focus_begins', target);
            this.io.event('focus_begins', { target: this.target });
            await this.focus(this.target, this.options.durations.focus);
            this.io.event('focus_ends');
            await sleep(this.options.durations.inter_block);
            this.io.event('block_begins', { target: this.target });
            await this.block(this.options.repetitions.train);
            this.io.event('block_ends');
        }
        this.target = null;
        this.trigger('training_ends');
        this.io.event('training_ends');
        this.status = 'idle';
        this.io.event('calibration_ends');
    }

    /**
     * Start testing
     */
    async test() {
        this.io.event('testing_begins');
        this.status = 'testing';
        while (this.status == 'testing') {
            await sleep(this.options.durations.inter_block);
            await this.loop(this.options.repetitions.test);
        }
        this.io.event('testing_ends');
    }

    /**
     * Stop testing
     */
    stop() {
        if (this.status == 'testing') this.status = 'idle';
    }

    /**
     * Set the prediction
     */
    predict(symbol) {
        if (this.status == 'testing') this.target = this.options.symbols.indexOf(symbol);
    }

}


Object.assign(Speller.prototype, Dispatcher);


/**
 * Set a CSS variable
 *
 * @param {string} variable name
 * @param {string|number} value
 */
function set_css_var(name, value) {
    document.documentElement.style.setProperty(name, value);
}

/**
 * Get a CSS variable
 *
 * @param {string} variable name
 */
function get_css_var(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

/**
 * Text to speech synthesis
 *
 * @param {string} text
 */
function speak(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}
