import { Block } from "./Block.js";

export class Pill {
    constructor(pos, size, orientation, colors) {
        this.pos = pos;
        this.size = size;
        this.colors = colors;
        this.base_colors = colors;
        this.blocks = [];
        this.orientation = orientation;
        this.generateBlocks();
    }

    generateBlocks() {
        this.blocks = [];
        let [x, y] = this.pos;
        for (let i = 0; i < 2; i++) {
            const offset = 0 + i * this.size;
            if (this.orientation % 2 == 0) {
                x += offset;
            } else {
                y -= offset;
            }
            this.blocks.push(new Block([x, y], this.size, this.colors[i]));
        }
    }

    getBounds() {
        const bounds = {
            xl: this.pos[0],
            xr: this.pos[0] + this.size * 2,
            yt: this.pos[1],
            yb: this.pos[1] + this.size
        }
        if (this.orientation % 2 != 0) {
            bounds.xr -= this.size;
            bounds.yt -= this.size;
        }
        
        return bounds;
    }

    updatePos(pos) {
        this.pos = pos;
        this.generateBlocks();
    }

    rotate(direction) {
        this.orientation += direction;
        switch (this.orientation) {
            case 4:
                this.orientation = 0;
                break;
            case -1:
                this.orientation = 3;
                break;

        }
        switch (this.orientation) {
            case 2:
            case 3:
                this.colors = [...this.base_colors].reverse();
                break;
            default:
                this.colors = this.base_colors;
        }
        this.generateBlocks();
    }

    draw(ctx) {
        this.blocks.forEach(block => {
            block.draw(ctx);
        })
    }
}