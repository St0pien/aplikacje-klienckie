export class Block {
    constructor(pos, size, color) {
        this.pos = pos;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        const [ x, y ] = this.pos;
        ctx.fillRect(x, y, this.size, this.size);
    }
}
