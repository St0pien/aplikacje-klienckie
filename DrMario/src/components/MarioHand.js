import { Sprite } from "./Sprite.js";
import { IMG } from './Imgs.js';

export class MarioHand {
    constructor() {
        this.sprite = new Sprite(IMG.oneHand);
        this.poses = [[750, 152], [744, 120]];
        this.pos = this.poses[1];
        this.pill = null;
        this.speed = 10;
    }

    preparePill(pill) {
        this.pill = pill;
        this.pill.pos = [715, 100];
        this.pos = this.poses[1]
        this.sprite.img = IMG.twoHand;
    }

    throw(x, y) {
        return new Promise(resolve => {
            this.pos = this.poses[0];
            this.sprite.img = IMG.oneHand;

            let rotationInterval = setInterval(() => {
                this.pill.orientation++;
                if (this.pill.orientation > 3) {
                    this.pill.orientation = 0;
                }
            }, 1)

            if (this.pill) this.pill.pos[0] -= 4;

            let interval = setInterval(() => {
                if (this.pill.pos[0] > x) {
                    this.pill.pos[0] -= this.speed;
                }

                if (this.pill.pos[1] > 20) {
                    this.pill.pos[1] -= this.speed;
                }

                if (this.pill.pos[0] < x+30) {
                    this.pill.pos[1] += this.speed*2;
                    if (this.pill.pos[0] < x) {
                        this.pill.pos[0]++;
                    }
                    clearInterval(rotationInterval);
                    this.pill.orientation = 0;
                }

                if (this.pill.pos[0] <= x && this.pill.pos[1] >= y) {
                    this.pill.pos[0] = x;
                    this.pill.pos[1] = y;
                    clearInterval(interval);
                    const newPill = Object.create(this.pill);
                    this.pill = null;
                    resolve(newPill);
                }
            }, 10);
        });
    }

    draw(ctx) {
        const [x, y] = this.pos;
        this.sprite.draw(ctx, x, y);
        if (!this.pill) return;
        this.pill.generateBlocks();
        this.pill.blocks.forEach(b => b.draw(ctx));
    }
}