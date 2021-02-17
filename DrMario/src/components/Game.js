import { Input } from './Input.js';
import { Pill } from './Pill.js';
import { Virus } from './Virus.js';

export class Game {
    constructor() {
        this.gameObjects = [];
        this.input = new Input();
        this.inputDelay = 100;
        this.inputActive = true;
        this.lastUpdate = 0;
        this.screen = document.querySelector('#window');
        this.ctx = this.screen.getContext('2d');
        this.blockSize = 25;
        this.xOffset = this.screen.width / 2 - this.blockSize * 4;
        this.yOffset = 150;
        this.colors = ['red', 'blue', 'yellow'];
        this.activePill = null;
        this.activeRow = 0;
        this.activeCol = 3;
        this.grid = new Array(16).fill(0);
        this.grid = this.grid.map(() => new Array(8));
        this.dropDelay = 1000;
        this.shouldDrop = false;
        this.viruses = 5;
    }

    addGameObject(...objects) {
        this.gameObjects.push(...objects);
    }

    randomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    spawnViruses() {
        const colors = [...this.colors];
        for (let i=0; i<this.viruses; i++) {
            if (colors.length == 0) colors.push(...this.colors);
            const colorIndex = Math.floor(Math.random() * colors.length);
            const color = colors.splice(colorIndex, 1);
            let r,c;
            do {
                [r, c] = [10, 8].map(size => Math.floor(Math.random() * size));
                r += 6;
            } while (this.grid[r][c]);
            this.grid[r][c] = new Virus([c*this.blockSize + this.xOffset, r*this.blockSize+this.yOffset], this.blockSize, color);
        }
    }

    start() {
        this.dropInterval = setInterval(() => {
            this.shouldDrop = true;
        }, this.dropDelay);

        this.spawnViruses();
        
        const loop = () => {
            if (performance.now() - this.lastUpdate >= 1 / 120 * 1000) {
                setTimeout(() => {
                    this.lastUpdate = performance.now();

                    // Updates here
                    this.update();

                    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
                    // Draw here
                    this.draw();
                });
            }
            this.frame = window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
    }

    pause() {
        window.cancelAnimationFrame(this.frame);
    }

    newPill() {
        const x = 3 * this.blockSize + this.xOffset;
        const y = this.yOffset;
        const colors = Array.from({ length: 2 }, () => this.randomColor());
        this.activePill = new Pill([x, y], this.blockSize, 0, colors);
        this.activeCol = 3;
        this.activeRow = 0;
    }

    pauseInput() {
        if (this.inputTimeout) clearTimeout(this.inputTimeout);
        this.inputActive = false;
        this.inputTimeout = setTimeout(() => {
            this.inputActive = true;
        }, this.inputDelay);
    }

    scanSquare(x, y) {
        const lines = [];
        lines.push(this.grid[x])
        lines.push(this.grid.map(row => row[y]));
        const toRemove = [];

        lines.forEach(line => {
            if (!line) return;

            let combo = 0;
            let color = null;
            const blocks = [];

            for (let block of line) {
                if (!(block && block.color == color)) {
                    if (combo < 4) {
                        blocks.splice(-combo);
                    } else {
                        break;
                    }
                    combo = 0;
                }

                combo++;
                color = block ? block.color : null;
                blocks.push(block);
            }
            if (blocks.length < 4) blocks.splice(-combo);
            toRemove.push(...blocks);
        });
        const indexes = toRemove.map(block => {
            let cords;
            this.grid.forEach((row, x) => {
                row.forEach((b, y) => {
                    if (b.pos[0] == block.pos[0] && b.pos[1] == block.pos[1]) {
                        cords = [x, y];
                    }
                });
            });
            return cords;
        });
        indexes.forEach(([x, y]) => {
            delete this.grid[x][y];
        });
    }

    scanCombos() {
        this.scanSquare(this.activeRow, this.activeCol);
        this.scanSquare(this.activeRow-1, this.activeCol);
        this.scanSquare(this.activeRow, this.activeCol+1);
    }

    checkCollision() {
        if (!this.activePill) return;
        const collision = () => {
            if (this.activeRow == 15) return true;
            const underBlocks = [];
            underBlocks.push(this.grid[this.activeRow + 1][this.activeCol]);
            if (this.activePill.orientation % 2 == 0) {
                underBlocks.push(this.grid[this.activeRow + 1][this.activeCol + 1]);
            }
            if (underBlocks.findIndex(block => block !== undefined) > -1) return true;
            return false;
        }
        if (collision()) {
            this.grid[this.activeRow][this.activeCol] = this.activePill.blocks.shift();
            if (this.activePill.orientation % 2 == 0) {
                this.grid[this.activeRow][this.activeCol + 1] = this.activePill.blocks.shift();
            } else {
                this.grid[this.activeRow - 1][this.activeCol] = this.activePill.blocks.shift();
            }
            this.activePill = null;
            this.scanCombos();
        }
    }

    drop() {
        this.checkCollision();
        if (!this.activePill) return;
        const [x, y] = this.activePill.pos;
        const { yb } = this.activePill.getBounds();
        if (yb - this.yOffset + this.blockSize <= this.blockSize * 16) {
            this.activePill.updatePos([x, y + this.blockSize]);
            this.activeRow++;
            this.checkCollision();
            this.pauseInput();
        }
    }

    validateMove(pill) {
        const { xl, xr, yt } = pill.getBounds();

        if (!(xl - this.xOffset >= 0)) {
            return false;
        }

        if (!(xr - this.xOffset <= this.blockSize * 8)) {
            return false;
        }

        if (!(yt - this.yOffset >= 0)) {
            return false;
        }

        const cords = pill.blocks.map(({ pos }) => {
            const [x, y] = pos;
            return [(y - this.yOffset) / this.blockSize, (x - this.xOffset) / this.blockSize];
        });

        if (cords.findIndex(([row, col]) => this.grid[row][col] != undefined) > -1) {
            return false;
        }

        return true;
    }

    moveLeft() {
        const [x, y] = this.activePill.pos;
        const posChange = [x - this.blockSize, y];
        const futurePill = Object.create(this.activePill);
        futurePill.updatePos(posChange);
        if (this.validateMove(futurePill)) {
            this.activePill.updatePos(posChange);
            this.activeCol--;
            this.pauseInput();
            return true;
        }
        return false;
    }

    handleInput() {
        if (this.input.keydown('a', 'arrowleft')) {
            this.moveLeft();
        }
        if (this.input.keydown('d', 'arrowright')) {
            const [x, y] = this.activePill.pos;
            const posChange = [x + this.blockSize, y];
            const futurePill = Object.create(this.activePill);
            futurePill.updatePos(posChange);
            if (this.validateMove(futurePill)) {
                this.activePill.updatePos(posChange);
                this.activeCol++;
                this.pauseInput();
            }
        }

        if (this.input.keydown('shift')) {
            const futurePill = Object.create(this.activePill);
            futurePill.rotate(1);
            if (this.validateMove(futurePill)) {
                this.activePill.rotate(1);
                this.pauseInput();
            } else if (this.activeRow != 0 && !this.input.keydown('d', 'arrowright')) {
                if (this.moveLeft())
                    this.handleInput();
            }
        }

        if (this.input.keydown('w', 'arrowup')) {
            const futurePill = Object.create(this.activePill);
            futurePill.rotate(-1);
            if (this.validateMove(futurePill)) {
                this.activePill.rotate(-1);
                this.pauseInput();
            } else if (this.activeRow != 0 && !this.input.keydown('d', 'arrowright')) {
                if (this.moveLeft())
                    this.handleInput();
            }
        }

        if (this.input.keydown('s', 'arrowdown')) {
            this.drop()
            const dropping = setInterval(() => {
                if (this.activeRow == 0) {
                    clearInterval(dropping);
                    return;
                }
                this.drop();
            }, 10)
            
        }
    }

    update() {
        if (this.inputActive) {
            this.handleInput();
        }

        if (this.shouldDrop) {
            this.drop();
            this.shouldDrop = false;
        }

        if (!this.activePill) {
            this.newPill();
        }

        this.addGameObject(...this.activePill.blocks);
        const gridBlocks = this.grid.reduce((acc, next) => [...next, ...acc]).filter(block => block !== undefined);
        this.addGameObject(...gridBlocks);
    }

    draw() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 8; j++) {
                this.ctx.strokeRect(this.xOffset + j * this.blockSize, this.yOffset + i * this.blockSize, this.blockSize, this.blockSize);
            }
        }

        this.gameObjects.forEach(gameObject => {
            gameObject.draw(this.ctx);
        });
        this.gameObjects = [];
    }
}