import { Block } from './Block.js';

export class Virus extends Block {
    constructor(pos, size, color) {
        super(pos, size, color);
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.pos[0]+this.size/4, this.pos[1]+this.size/4, this.size/2, this.size/2)
    }
}