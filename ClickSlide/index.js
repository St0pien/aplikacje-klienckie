class Square {
    constructor(parent, pos, boardSize) {
        this.ref = document.createElement('div');
        this.ref.classList.add('square');
        parent.appendChild(this.ref);
        this.boardSize = boardSize;
        const [ x, y ] = pos;
        this.correctPos = { x, y };
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
    constructor(size, ref, img, winCallback, randomizeCallback) {
        this.winCallback = winCallback;
        this.randomizeCallback = randomizeCallback;
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
        this.checkWin();
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

            if (counter > this.size*20 ) {
                clearInterval(handler);
                this.randomizeCallback();
            } 
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

    checkWin() {
        const condition = this.squares.every(sqr => {
            const { correctPos, pos } = sqr;
            if (correctPos.x != pos.x) return false;
            if (correctPos.y != pos.y) return false;
            return true;
        })
        if (condition) this.winCallback();
    }
}

class Timer {
    constructor(ref) {
        this.ref = ref;
        this.digits = [];
        this.ref.childNodes.forEach(imgDigit => {
            const reg = /img\/clock\/c\d.gif$/
            if (reg.test(imgDigit.src)) {
                this.digits.push(imgDigit);
            }
        });
    }

    start() {
        this.startTime = new Date();
        this.interval = setInterval(() => this.updateTime(), 1);
    }

    stop() {
        clearInterval(this.interval);
    }

    static format(num, range) {
        if (num.toString().length < range) {
            let result = '';
            for (let i=0; i<range-num.toString().length; i++) {
                result += '0';
            }
            return `${result}${num}`;
        }
        return num;
    }

    updateTime() {
        const time = new Date(new Date() - this.startTime);
        this.currentTime = time;
        const milisecs = Timer.format(time.getMilliseconds(), 3);
        const secs = Timer.format(time.getSeconds(), 2);
        const mins = Timer.format(time.getMinutes(), 2);
        const hours = Timer.format(time.getHours() - 1, 2);
        const timeStr = `${hours}${mins}${secs}${milisecs}`
        timeStr.split('').forEach((digit, index) => {
            this.digits[index].src = `img/clock/c${digit}.gif`;
        });
    }
}

function main() {
    const button = document.querySelector('.button');
    const input = document.querySelector('.input-size');

    const timerEl = document.querySelector('.timer');
    const timer = new Timer(timerEl);

    const boardEl = document.querySelector('.board');
    let board;

    button.addEventListener('click', () => {
        boardEl.innerHTML = '';
        const size = parseInt(input.value);
        board = new Board(size, boardEl, 'img/img1.jpg', () => timer.stop(), () => timer.start());
        board.randomize();
    });
}

main();
