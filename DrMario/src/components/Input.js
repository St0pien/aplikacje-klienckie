export class Input {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            e.preventDefault();
            if (!e.repeat) {
                this.keys.push(e.key.toLowerCase());
            }
        });

        window.addEventListener('keyup', e => {
            this.keys = this.keys.filter(key => key != e.key.toLowerCase());
        });
    }

    keydown(...inputs) {
        return inputs.findIndex(i => this.keys.findIndex(k => i == k) > -1) > -1;
    }
}