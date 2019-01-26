import * as Const from "./const.js";
import Game from "./game.js"
import Resources from "./resources.js"
import Point from "./point.js";

class Lock extends Game {
    constructor() {
        super();
        this.color;
        this.level;
        this.score;
        this.open;
        this.state;
        this.count;
        this.aimAng;
        this.pinAng;
        this.dir;
        this.speed;
        this.crossed;
        this.shakeTime = .75;
        this.hiscore = 0;
        this.bld = new Point();
        this.pinPos = new Point();
        this.aimPos = new Point();
        this.pos = new Point();
        this.orig = new Point();
        this.canvas.addEventListener("click", () => {
            switch (this.state) {
                case Const.START:
                    this.state = Const.CREATE;
                    break;
                case Const.STOP:
                    this.state = Const.WAIT;
                    break;
                case Const.TURN:
                    this.state = Const.STOP;
                    break;
                case Const.OPEN:
                    this.count = this.level;
                    this.open = false;
                    this.state = Const.NEXT;
                    break;
                case Const.GAMEOVER:
                    this.reset();
                    break;
            }
        }, false);

        this.res = new Resources(() => {
            this.bld.set(this.res.images[Const.CLD].width >> 1, this.res.images[Const.CLD].height >> 1);
            this.pos.set(Const.WIDTH >> 1, Const.HEIGHT >> 1);
            this.orig.set(this.pos.x, this.pos.y);
            this.reset();
            this.loop();
        });
    }

    reset() {
        this.crossed = false;
        this.state = Const.START;
        this.speed = 1;
        this.level = this.count = 1;
        this.dir = -1;
        this.score = 0;
        this.open = false;
        this.aimAng = this.pinAng = 0;
        this.pinPos.set(Math.cos(this.pinAng), Math.sin(this.pinAng));
        this.aimPos.set(Math.cos(this.aimAng), Math.sin(this.aimAng));
        this.color = Const.COLORS[Math.floor(Math.random() * Const.COLORS.length)];
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);

        const i = this.open ? this.res.images[Const.OPN] : this.res.images[Const.CLD];
        this.ctx.drawImage(i, this.pos.x - this.bld.x, this.pos.y - this.bld.y - 7);

        this.ctx.lineWidth = 14;
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y + 47, 46, 0, Const.TWO_PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "#1a0096"; //"blue";
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x + 46 * this.aimPos.x, this.pos.y + 47 + 46 * this.aimPos.y, 5, 0, Const.TWO_PI);
        this.ctx.fill();
        this.ctx.save();
        this.ctx.beginPath()
        this.ctx.fillStyle = "#970000";
        "red";
        this.ctx.translate(this.pos.x + this.pinPos.x * 46, 47 + this.pos.y + this.pinPos.y * 46);
        this.ctx.rotate(this.pinAng)
        this.ctx.fillRect(-6, -2, 12, 4)
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "center";
        this.ctx.font = "50px 'Press Start 2P'";
        this.ctx.fillText(`${this.count}`, Const.WIDTH >> 1, Const.HEIGHT * .95);

        this.ctx.font = "20px 'Press Start 2P'";
        this.ctx.fillText(`SCORE: ${this.score}`, Const.WIDTH >> 1, Const.HEIGHT * .1);

        if (this.state === Const.GAMEOVER) {
            this.ctx.fillText(`BEST: ${this.hiscore}`, Const.WIDTH >> 1, Const.HEIGHT * .17);
        }
    }

    update(dt) {
        switch (this.state) {
            case Const.CREATE:
                this.crossed = false;
                let na;
                do {
                    na = Math.random() * Const.TWO_PI;
                } while (this.angleDifference(na, this.aimAng) < 90);
                this.aimAng = na;
                this.aimPos.set(Math.cos(this.aimAng), Math.sin(this.aimAng));
                this.state = Const.TURN;
                break;
            case Const.TURN:
                this.pinAng += dt * this.speed * this.dir;
                if (this.pinAng > Const.TWO_PI) {
                    this.pinAng -= Const.TWO_PI;
                }
                this.pinPos.set(Math.cos(this.pinAng), Math.sin(this.pinAng));
                const diff = this.angleDifference(this.aimAng, this.pinAng);
                if (!this.crossed && diff < 2) {
                    this.crossed = true;
                }
                if (this.crossed && diff > 9) {
                    this.state = Const.SHAKE;
                    //console.log(diff, 2);
                }
                break;
            case Const.OPEN:
                this.open = true;
                break;
            case Const.NEXT:
                let z;
                do {
                    z = Const.COLORS[Math.floor(Math.random() * Const.COLORS.length)];
                } while (z === this.color);
                this.color = z;
                this.state = Const.CREATE;
                break;
            case Const.STOP:
                const dif = this.angleDifference(this.pinAng, this.aimAng);
                if (dif < 7.44 || dif > 352.56) {
                    this.dir = -this.dir;
                    if (--this.count < 1) {
                        this.state = Const.OPEN;
                        this.level++;
                        this.score++;
                        this.speed += .15;
                        if (this.score > this.hiscore) this.hiscore = this.score;
                    } else {
                        this.state = Const.CREATE;
                    }
                } else {
                    //console.log(dif, 1, this.crossed);
                    this.state = Const.SHAKE;
                }
                break;
            case Const.SHAKE:
                if ((this.shakeTime -= dt) < 0) {
                    this.shakeTime = .75;
                    this.pos.x = this.orig.x;
                    this.pos.y = this.orig.y;
                    this.state = Const.GAMEOVER;
                    return;
                }
                this.pos.x += Math.random() < .5 ? -1 : 1;
                this.pos.y += Math.random() < .5 ? -1 : 1;
                break;
            case Const.GAMEOVER:
                break;
        }
    }

    angleDifference(a, b) {
        const a1 = 57.2957795 * a,
            a2 = 57.2957795 * b;
        let c = Math.abs((a1 + 180 - a2) % 360 - 180);
        if (c > 360) c -= 360;
        return c;
    }
}

new Lock();