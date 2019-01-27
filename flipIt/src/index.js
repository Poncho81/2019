import * as Const from "./const.js";
import Game from "./game.js"
import Resources from "./resources.js"
import Background from "./back.js";
import Hero from "./hero.js";
import Spikes from "./spikes.js";
import Explosion from "./explosion.js";

class FlipIt extends Game {
    constructor() {
        super();

        this.wallPos = 0;
        this.gameOver;
        this.score;
        this.hiscore = 0;
        this.speed;
        this.timer;
        this.time;
        this.state;
        this.dist;
        this.back = new Background();
        this.explo = new Explosion();

        this.res = new Resources(() => {
            this.wallSize = this.res.images[Const.WL].height;
            this.spikes = new Spikes(this.res.images[Const.SL], this.res.images[Const.SR]);
            this.hero = new Hero(this.res.images[Const.HL], this.res.images[Const.HR]);
            this.reset();
            this.loop();
        });

        this.canvas.addEventListener("click", (e) => {
            if (this.state === Const.OVER) {
                this.reset();
            } else {
                this.hero.jump();
            }

        }, false);
    }

    reset() {
        this.spikes.reset();
        this.explo.reset();
        this.speed = 170;
        this.gameOver = false;
        this.score = 0;
        this.time = 1.2;
        this.timer = this.time;
        this.state = Const.GAME;
    }

    draw() {
        this.back.draw(this.ctx);
        this.ctx.drawImage(this.res.images[Const.WL], (Const.WIDTH >> 1) - 20, this.wallPos);
        this.ctx.fillStyle = "white";
        switch (this.state) {
            case Const.GAME:
                this.hero.draw(this.ctx);
                this.spikes.draw(this.ctx);
                this.ctx.font = "30px 'Press Start 2P'";
                this.ctx.textAlign = "right";
                this.ctx.fillText(`${this.score}`, Const.WIDTH - 6, 40);
                break;
            case Const.EXPLO:
                this.spikes.draw(this.ctx);
                this.explo.draw(this.ctx);
                break;
            case Const.OVER:
                this.spikes.draw(this.ctx);
                this.ctx.textAlign = "center";
                this.ctx.font = "35px 'Press Start 2P'";
                this.ctx.fillText(`SCORE: ${this.score}`, Const.WIDTH >> 1, Const.HEIGHT * .45);
                this.ctx.fillText(`BEST: ${this.hiscore}`, Const.WIDTH >> 1, Const.HEIGHT * .55);
                this.ctx.font = "12px 'Press Start 2P'";
                this.ctx.fillText(`CLICK TO PLAY`, Const.WIDTH >> 1, Const.HEIGHT * .95);
                break;
        }
    }

    update(dt) {
        this.back.update(dt);
        switch (this.state) {
            case Const.GAME:
                const spd = dt * this.speed;
                this.spikes.update(spd);
                this.checkCollision();

                if ((this.timer -= dt) < 0) {
                    this.score++;
                    if (this.score > this.hiscore) this.hiscore = this.score;
                    this.timer = this.time;

                    if (this.score % 10 === 0) {
                        this.time -= .1;
                        if (this.time < .4) {
                            this.time = .4;
                            this.spikes.dist += 4;
                            return;
                        }
                        this.speed += 20;
                    }
                }
                break;
            case Const.EXPLO:
                if (this.explo.update(dt)) {
                    this.state = Const.OVER;
                }
                break;
            case Const.OVER:
                break;
        }


    }

    checkCollision() {
        function collided(a, b) {
            return !(((a.b < b.t) || (a.t > b.b) || (a.r < b.l) || (a.l > b.r)));
        }

        const b = this.hero.box;
        for (let s of this.spikes.spikes) {
            if (collided(b, s.box)) {
                this.gameOver = true;
                this.state = Const.EXPLO;
                const m = this.hero.mid;
                this.explo.start(m.x, m.y);
                return;
            }
        }
    }

    mousePressed(e) {
        if (this.gameOver) {

            return;
        }
    }
}

new FlipIt();