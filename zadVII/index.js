class Square {
    constructor(parent, pos, boardSize) {
        this.ref = document.createElement('div');
        this.ref.classList.add('square');
        parent.appendChild(this.ref);
        this.boardSize = boardSize;
        const [ x, y ] = pos;
        this.ref.style.backgroundPosition = `${y*100/(this.boardSize-1)}% ${x*100/(this.boardSize-1)}%`;
        this.updatePosition(x, y);
    }

    updatePosition(x, y) {
        this.pos = { x, y };
        this.ref.style.gridRow = x+1;
        this.ref.style.gridColumn = y+1;
        this.ref.style.opacity = 1;
    }

    remove() {
        this.ref.remove();
    }
}

class Board {
    constructor(size, ref, img) {
        this.size = size;
        this.ref = ref;
        this.img = img;
        document.documentElement.style.setProperty('--img-url', `url(${this.img})`);
        document.documentElement.style.setProperty('--board-res', size);
        this.squares = [];
        this.createSquares();
        this.emptyCords = {
            x: size-1,
            y: size-1
        }
        this.addClicks();
    }

    createSquares() {
        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                this.squares.push(new Square(this.ref, [i, j], this.size));
            }
        }
        this.squares.pop().remove();
    }

    getSquare(x, y) {
        return this.squares.find(({ pos }) => x == pos.x && y == pos.y);
    }

    moveSquare(x, y) {
        const square = this.getSquare(x, y);
        square.updatePosition(this.emptyCords.x, this.emptyCords.y);
        this.emptyCords = { x, y };
    }

    isLegal(x, y) {
        const xDist = Math.abs(this.emptyCords.x - x);
        const yDist = Math.abs(this.emptyCords.y - y);
        return xDist + yDist == 1;
    }

    randomize() {
        let counter = 0;
        let lastMove = {
            x: 0,
            y: 0
        };
        const handler = setInterval(() => {
            let x=0, y=0;
            do {
                x = Math.floor(Math.random() * this.size);
                y = Math.floor(Math.random() * this.size);
            } while (!this.isLegal(x, y) || lastMove.x == x && lastMove.y == y)
            lastMove = this.emptyCords;
            this.moveSquare(x, y);
            counter++;

            if (counter > this.size*20 ) clearInterval(handler);
        }, 10);
    }

    addClicks() {
        this.squares.forEach((sqr) => {
            sqr.ref.addEventListener('click', () => {
                const { x, y } = sqr.pos;
                if (this.isLegal(x, y)) this.moveSquare(x, y);
            });
        });
    }
}
const board = new Board(4, document.querySelector('.board'), 'img/img2.jpg');
setTimeout(() => board.randomize(), 1500);
