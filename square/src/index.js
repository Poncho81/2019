import * as Const from "./const.js";
import Game from "./game.js"
import Background from "./back.js";
import Rect from "./rect.js"

class Square extends Game {
    constructor() {
        super();
        this.back = new Background();
        this.rect = new Rect();
        this.sqrW;
        this.score;
        this.counter;
        this.level;
        this.hiscore = 0;
        this.waitTIme;
        this.showShadow;
        this.state;
        this.colorIdx;

        this.canvas.addEventListener("mousedown", (e) => {
            if (this.state === Const.GROW) this.mousePressed(true);
        }, false);
        this.canvas.addEventListener("mouseup", (e) => {
            switch (this.state) {
                case Const.GROW:
                    this.mousePressed(false);
                    break;
                case Const.DEAD:
                    this.reset();
                    break;
            }
        }, false);

        this.reset();
        this.loop();
    }

    reset() {
        this.newRect();
        this.state = Const.MOVEIN;
        this.showShadow = true;
        this.waitTIme = 1;
        this.score = this.counter = 0;
        this.level = 1;
    }

    newRect() {
        this.colorIdx = Math.floor(Math.random() * Const.COLORS.length);
        this.sqrW = this.back.start(this.colorIdx);
        this.rect.reset(this.colorIdx);
    }

    draw() {
        this.ctx.fillStyle = Const.COLORS[this.colorIdx][0];
        this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);

        this.back.draw(this.ctx);
        this.rect.draw(this.ctx);

        if (this.showShadow) {
            this.ctx.fillStyle = `rgba(255,255,255,.1)`;
            const hw = this.sqrW / 2,
                h = Const.HEIGHT - 90;
            this.ctx.fillRect((Const.WIDTH >> 1) - hw, h - this.sqrW, this.sqrW, this.sqrW);
        }

        if (this.state != Const.DEAD && this.state != Const.SCORE) {
            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "center";
            this.ctx.font = "20px 'Press Start 2P'";
            this.ctx.fillText(`${this.level - this.counter}`, Const.WIDTH >> 1, Const.HEIGHT - 20);
        }

        switch (this.state) {
            case Const.SCORE:
                break;
            case Const.DEAD:
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.font = "35px 'Press Start 2P'";
                this.ctx.fillText(`SCORE: ${this.score}`, Const.WIDTH >> 1, Const.HEIGHT * .35);
                this.ctx.fillText(`BEST: ${this.hiscore}`, Const.WIDTH >> 1, Const.HEIGHT * .45);
                this.ctx.font = "12px 'Press Start 2P'";
                this.ctx.fillText(`CLICK TO PLAY`, Const.WIDTH >> 1, Const.HEIGHT * .95);
                break;
        }
    }

    update(dt) {
        switch (this.state) {
            case Const.MOVEIN:
                if (!this.back.update(dt)) {
                    this.state = Const.GROW;
                }
                break;
            case Const.GROW:
                this.rect.update(dt);
                break;
            case Const.GOUP:
                if (this.rect.update(dt)) {
                    this.newRect();
                    this.state = Const.MOVEIN;
                    if (!this.counter) this.showShadow = true;
                }
                break;
            case Const.SCORE:
                if ((this.waitTIme -= dt) < 0) {
                    this.waitTIme = 1;
                    this.state = Const.GOUP;
                    this.rect.state = Const.GOUP;
                }
                break;
            case Const.DEAD:
                break;
            case Const.FALL:
                this.rect.update(dt);
                if (this.rect.box.collided(this.back.boxes[0])) {
                    this.rect.stop(Const.DEAD, this.back.boxes[0]);
                    this.state = Const.DEAD;
                } else if (this.rect.box.collided(this.back.boxes[1])) {
                    this.rect.stop(Const.SCORE, this.back.boxes[1]);
                    this.state = Const.SCORE;
                    if (++this.counter === this.level) {
                        this.score++;
                        this.level++;
                        this.counter = 0;
                        if (this.score > this.hiscore) this.hiscore = this.score;
                    }
                } else if (this.rect.box.t > Const.HEIGHT) {
                    this.rect.state = Const.DEAD;
                    this.state = Const.DEAD;
                    console.log("fall");
                }
                break;
        }
    }

    mousePressed(down) {
        if (down) {
            this.rect.state = Const.GROW;
            this.showShadow = false;
        } else {
            this.rect.state = Const.FALL;
            this.rect.squareAng = 0;
            this.state = Const.FALL;
        }
    }
}

new Square();