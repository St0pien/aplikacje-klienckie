import { Block } from './Block.js';
import { AnimatedSprite } from './Sprite.js';
import { IMG, CORDS } from './Imgs.js';

export class Virus extends Block {
    constructor(pos, size, color) {
        super(pos, size, color);
        this.sprite = new AnimatedSprite(IMG[`${this.color}Virus`], 0, 2, CORDS.virus, CORDS.virus, 300);
    }

    draw(ctx) {
        if (this.destroyed) {
            this.sprite.cancelAnimation();
            this.sprite.yOffset = CORDS.virus;
        } 

        const [x, y] = this.pos;
        this.sprite.draw(ctx, x, y);
    }
}