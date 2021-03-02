function rays(ctx) {
    const lines = [];
    setInterval(() => {
        const newLine = [0, 0].map(() => Math.floor(Math.random()*ctx.canvas.width));
        newLine.push(Math.floor(Math.random() * 2**24).toString(16));
        lines.push(newLine);

        lines.forEach(([x, y, color]) => {
            ctx.beginPath();
            ctx.moveTo(ctx.canvas.width/2, ctx.canvas.height/2);
            ctx.strokeStyle = `#${color}`;
            ctx.lineTo(x, y);
            ctx.stroke();
        });
    }, 1);
}

function arcs(ctx) {
    ctx.strokeStyle = 'rgba(132, 0, 255, 0.2)';
    ctx.lineWidth = 10;
    const r = 50;
    
    const arcs = [];
    let mousePos = [];
    ctx.canvas.addEventListener("mousemove", e => {
        const { offsetX, offsetY } = e;
        mousePos = [offsetX, offsetY];
    });

    setInterval(() => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const [x, y] = mousePos;
        const startAngle = Math.random()*Math.PI*2;
        const endAngle = Math.random()*(2*Math.PI-startAngle) + startAngle;
        arcs.push([x, y, startAngle, endAngle])

        arcs.forEach(([ x, y, angle1, angle2 ]) => {
            ctx.beginPath();
            ctx.arc(x, y, r, angle1, angle2)
            ctx.stroke();
        });
    }, 10);
}

const speeds = [1, 3, 5];

class Dollar {
    constructor(ctx) {
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = `/img/d${Math.floor(Math.random() * 3) + 1}.png`;
        this.speed = speeds[Math.floor(Math.random() * speeds.length)];
        this.vector = [0, 0].map(() => Math.floor(Math.random()*2) - 1);
        this.vector = this.vector.map(axis => axis == 0 ? 1: axis);
        this.pos = [0, 0];
        this.pos[0] = Math.floor(Math.random() * (this.ctx.canvas.width - this.img.width));
        this.pos[1] = Math.floor(Math.random() * (this.ctx.canvas.height - this.img.height));
    }

    draw() {
        this.pos = this.pos.map((axis, index) => axis += this.vector[index] * this.speed);
        const [x, y] = this.pos;

        if (x < 0 || x + this.img.width > this.ctx.canvas.width) {
            this.vector[0] *= -1;
        }
        if (y < 0 || y + this.img.height > this.ctx.canvas.width) {
            this.vector[1] *= -1;
        }

        this.ctx.drawImage(this.img, x, y);
    }
}

function dollars(ctx) {
    const dollars = [];
    const frame = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        dollars.forEach(dollar => dollar.draw());
        requestAnimationFrame(frame);
    }
    frame();

    setInterval(() => {
        dollars.push(new Dollar(ctx));
    }, 100)
}

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

dollars(ctx);
