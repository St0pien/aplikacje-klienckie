import { AnimatedSprite } from "./Sprite.js";
import { CORDS, IMG } from './Imgs.js';

export class Glass {
    constructor(colors, pos) {
        this.animDelay = 200;
        this.colors = colors.map(color => {
            return {
                sprite: new AnimatedSprite(IMG[`${color}Glass`], 0, 4, CORDS.glassVirus[0], CORDS.glassVirus[1], this.animDelay),
                color
            }
        });
        this.pos = pos;
        this.angles = [330, 200, 90];
        this.angles = this.angles.map(angle => angle*Math.PI/180);
        this.offsets = [
            [0, 0],
            [0, 0],
            [0, 0]
        ];
        this.interval = setInterval(() => {
            this.angles = this.angles.map(angle => angle -= .3);
        }, 1000)
    }

    pause() {
        clearInterval(this.interval);
        this.colors.forEach(({ sprite }) => {
            sprite.frame = 1;
        })
    }

    update(grid) {
        const blocks = grid.reduce((acc, next) => [...acc, ...next]);
        this.colors = this.colors.filter(({ color }) => {
            if (blocks.findIndex(b => b && b.id == null && b.color == color) > -1) {
                return true;
            }
        });
    }

    draw(ctx) {
        const [x, y] = this.pos;
        this.offsets = this.angles.map((angle) => {
            const y = 80 * Math.sin(angle);
            const x = 80 * Math.cos(angle);
            return [x, y];
        });
        this.colors.forEach(({ sprite }, index) => {
            sprite.draw(ctx, x + this.offsets[index][0], y + this.offsets[index][1]);
        });
    }
}