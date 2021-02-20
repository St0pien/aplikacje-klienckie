export class Sprite {
    constructor(img) {
        this.img = img;
    }

    draw(ctx, x=0, y=0, sx, sy, sw, sh, dw, dh) {
        if (sx != undefined && sy != undefined) {
            ctx.drawImage(this.img, sx, sy, sw, sh, x, y, dw, dh);
        } else {
            ctx.drawImage(this.img, x, y);
        }
    }
}

export class AnimatedSprite extends Sprite {
    constructor(img, yOffset, maxFrame, frameWidth, frameHeight, delay=null) {
        super(img);
        this.frame = 0;
        this.yOffset = yOffset;
        this.maxFrame = maxFrame;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        if (delay) {
            this.delay = delay;
            this.interval = setInterval(() => {
                this.nextFrame();
            }, delay)
        }
    }

    cancelAnimation() {
        clearInterval(this.interval);
        this.frame = 0;
    }

    nextFrame() {
        this.frame++;
        if (this.frame >= this.maxFrame) {
            this.frame = 0;
        }
    }

    draw(ctx, x, y) {
        ctx.drawImage(this.img, this.frameWidth*this.frame, this.yOffset, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameWidth);
    }
}
