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

    moveSquare(x, y, check = true) {
        if (!this.isActive && check) return;

        const square = this.getSquare(x, y);
        square.updatePosition(this.emptyCords.x, this.emptyCords.y);
        this.emptyCords = { x, y };
        if (check) this.checkWin();
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
            this.moveSquare(x, y, false);
            counter++;

            if (counter > this.size**3) {
                clearInterval(handler);
                this.randomizeCallback();
                this.isActive = true;
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
        if (condition) {
            this.isActive = false;
            this.winCallback();
        }
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

    static formatNum(num, range) {
        if (num.toString().length < range) {
            let result = '';
            for (let i=0; i<range-num.toString().length; i++) {
                result += '0';
            }
            return `${result}${num}`;
        }
        return num;
    }

    static formatTime(time) {
        const milisecs = Timer.formatNum(time.getMilliseconds(), 3);
        const secs = Timer.formatNum(time.getSeconds(), 2);
        const mins = Timer.formatNum(time.getMinutes(), 2);
        const hours = Timer.formatNum(time.getHours() - 1, 2);
        return `${hours}${mins}${secs}${milisecs}`;
    }

    updateTime() {
        const time = new Date(new Date() - this.startTime);
        this.currentTime = time;
        const timeStr = Timer.formatTime(time);
        timeStr.split('').forEach((digit, index) => {
            this.digits[index].src = `img/clock/c${digit}.gif`;
        });
    }
}

class Classification {
    static parseCookies() {
        const classRegex = /^classification={.*}$/;
        const classCookie = document.cookie.split('; ').find(cookie => classRegex.test(cookie));
        if (!classCookie) return {};
        return JSON.parse(classCookie.split('=')[1]);
    }

    static addTime(time, nick, category) {
        const classObj = Classification.parseCookies();
        const name = `classification${category}`;
        if (!classObj[name]) classObj[name] = [];
        classObj[name].push({ nick, time: time.getTime() });
        classObj[name] = classObj[name].sort((a, b) => a.time - b.time);
        classObj[name] = classObj[name].slice(0, 10);
        document.cookie = `classification=${JSON.stringify(classObj)}; Expires=Wed, 21 Oct 3333 07:28:00 GMT;`;
    }

    static displayClassification(ref, category) {
        const classObj = Classification.parseCookies();
        const name = `classification${category}`;
        const classification = classObj[name];
        ref.innerHTML = '';
        if (!classification) return;

        const frag = document.createDocumentFragment();
        classification.forEach(({ nick, time }, index) => {
            const div = document.createElement('div');
            div.classList.add('top-row');
            const timeArr = Timer.formatTime(new Date(time)).split('');
            timeArr.splice(2, 0, ':');
            timeArr.splice(5, 0, ':');
            timeArr.splice(8, 0, '.');
            div.innerHTML = `${index+1}. ${nick} - ${timeArr.join('')}`;
            frag.appendChild(div);
        });
        ref.appendChild(frag);
    }

    static getNick() {
        return localStorage.getItem('nick');
    }

    static setNick(nick) {
        localStorage.setItem('nick', nick);
    }
}

class Slider {
    constructor(ref, imgCount) {
        this.ref = ref;
        this.currentImg = 1;
        this.isScrolling = false;
        const frag= document.createDocumentFragment();
        for (let i=1; i<=imgCount; i++) {
            const img = document.createElement('img');
            img.src = `img/img${i}.jpg`;
            frag.appendChild(img);
        }
        this.ref.appendChild(frag);
        this.width = Math.round(this.ref.clientWidth);
        this.size = imgCount;

        const left = document.querySelector('.left');
        const right = document.querySelector('.right');
        left.addEventListener('click', () => this.slideLeft());
        right.addEventListener('click', () => this.slideRight());
    }

    getPath() {
        return `img/img${this.currentImg}.jpg`;
    }

    slideLeft() {
        if (this.isScrolling) return;

        this.currentImg--;
        if (this.currentImg <= 0) {
            this.currentImg = this.size;
        }

        this.ref.prepend(this.ref.lastElementChild);
        this.ref.scrollTo(this.width, 0);
        this.animateScroll(0);
    }

    slideRight() {
        if (this.isScrolling) return;

        this.currentImg++;
        if (this.currentImg > this.size) {
            this.currentImg = 1;
        }

        this.animateScroll(this.width).then(() => {
            this.ref.appendChild(this.ref.firstElementChild);
            this.ref.scrollTo(0, 0);
        });
    }

    async animateScroll(value) {
        this.isScrolling = true;
        this.ref.scrollTo({
            left: value,
            behavior: 'smooth',
            duration: 20000
        });
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (Math.round(this.ref.scrollLeft) == value) {
                    clearInterval(interval);
                    this.isScrolling = false;
                    resolve();
                }
            });
        });
    }
}

function handleWin(timer, nick, category) {
    timer.stop();
    Classification.addTime(timer.currentTime, nick, category);
    Classification.setNick(nick);
    Classification.displayClassification(document.querySelector('.top'), category);
}

function main() {
    const buttons = document.querySelectorAll('.button');

    const timerEl = document.querySelector('.timer');
    const timer = new Timer(timerEl);

    const nickEl = document.querySelector('.input--text');
    nickEl.value = Classification.getNick();

    const sliderEl = document.querySelector('.thumbnail');
    const slider = new Slider(sliderEl, 7);

    const boardEl = document.querySelector('.board');
    let board;

    const top = document.querySelector('.top');

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            timer.stop();
            timer.startTime = new Date();
            timer.updateTime();
            boardEl.innerHTML = '';
            const size = 3+index;
            board = new Board(size, boardEl, slider.getPath(), () => handleWin(timer, nickEl.value, size), () => timer.start());
            Classification.displayClassification(top, size);
            setTimeout(() => board.randomize(), 1000);
        });
    });
}

main();
