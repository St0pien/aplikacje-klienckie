import { Sprite } from "./Sprite.js";
import { IMG } from './Imgs.js';

export class Stats {
    constructor(viruses, center) {
        this.score = 0;
        this.viruses = viruses;
        this.top = 0;
        this.getTop();
        this.status = null;
        this.center = center;
    }

    virusDown() {
        this.score += 100;
        this.viruses--;
    }

    getTop() {
        this.top = window.localStorage.getItem('top');
    }

    lost() {
        this.status = new Sprite(IMG.lost);
    }

    win() {
        this.status = new Sprite(IMG.win);
        const currentBest = window.localStorage.getItem('top');
        if (this.score > currentBest) {
            window.localStorage.setItem('top', this.score);
            this.getTop();
        }
    }

    draw(ctx) {
        ctx.fillStyle= "#6494ec";
        ctx.font = "24px 'Press Start 2P'";
        ctx.fillText((this.top ? this.top : 0).toString().padStart(7, '0'), 125, 145);
        ctx.fillText(this.score.toString().padStart(7, '0'), 125, 215);
        ctx.fillText(this.viruses.toString().padStart(2, '0'), 840, 530);

        if (this.status) {
            if (this.viruses > 0) {
                ctx.drawImage(IMG.marioLost, 710, 80);
            }
            this.status.draw(ctx, this.center-this.status.img.width / 2, 200);
        }
    }
}
