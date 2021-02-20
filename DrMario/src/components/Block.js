import { Sprite } from './Sprite.js';
import { IMG, CORDS } from './Imgs.js';

export class Block {
    constructor(pos, size, color, id=null, rotation=null) {
        this.id = id;
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.rotation = rotation;
        this.sprite = new Sprite(IMG[`${this.color}Pill`]);
        this.destroyed = false;
        this.single = false;
    }

    draw(ctx) {
        const [x, y] = this.pos;
        if (this.destroyed) {
            this.sprite.draw(ctx, x, y, CORDS.pill*2, 0, CORDS.pill, CORDS.pill, CORDS.pill, CORDS.pill);
            return;
        }

        if (this.single) {
            this.sprite.draw(ctx, x, y, 0, 0, CORDS.pill, CORDS.pill, CORDS.pill, CORDS.pill);
            return;
        }

        this.sprite.draw(ctx, x, y, this.rotation*CORDS.pill, CORDS.pill, CORDS.pill, CORDS.pill, CORDS.pill, CORDS.pill);
    }
}
