import * as Const from "./const.js";
import Game from "./game.js"
import Resources from "./resources.js";
import Enemies from "./enemies.js";
import Bonus from "./bonus.js";
import Player from "./player.js";
import Explosion from "./explosion.js";
import Sound from "./sound.js";
import Stars from "./stars.js";

class Flapypac extends Game {
    constructor() {
        super();
        this.state;
        this.scoreTime = .95;
        this.score;
        this.hiscore = 0;
        this.player;
        this.enemies;
        this.bonus;
        this.gameOverTime;
        this.backPos = 0;
        this.snd = new Sound(["../snd/hit.ogg", "../snd/hit.ogg", "../snd/hit.ogg",
            "../snd/cer.ogg", "../snd/mor.ogg", "../snd/xplo.ogg"
        ]);
        this.xplo = new Explosion();
        this.stars = new Stars();
        this.res = new Resources(() => {
            this.load();
            this.loop();
        });
        this.canvas.addEventListener("touchstart", () => {
            this.startTime = new Date().getTime();
            this.down();
        }, false);
        this.canvas.addEventListener("mousedown", () => {
            this.startTime = new Date().getTime();
            this.down();
        }, false);
        this.canvas.addEventListener("touchend", () => {
            if (new Date().getTime() - this.startTime > 1500) this.up();
        }, false);
        this.canvas.addEventListener("mouseup", () => {
            if (new Date().getTime() - this.startTime > 1500) this.up();
        }, false);

    }

    up() {
        if (this.player.bombs > 0) {
            this.player.bombs--;
            for (let f of this.enemies.enemies) {
                if (!f.alive) continue;
                f.alive = false;
                this.xplo.startExplosion(f.pos.x, f.pos.y, .25, f.clr);
                this.player.score += 3;
                this.playHit();
            }
        }
    }

    down() {
        switch (this.state) {
            case Const.START:
                this.reset();
                this.player.reset();
                this.enemies.reset();
                this.bonus.reset();
                this.state = Const.GAME;
                break;
            case Const.GAME:
                this.player.jump();
                break;
            case Const.OVER:
                break;
        }
    }

    load() {
        this.player = new Player(this.res.images[Const.PAC1], this.res.images[Const.PAC2], this.res.images[Const.PAC3]);
        this.enemies = new Enemies(
            this.res.images[Const.BLU1],
            this.res.images[Const.BLU2],
            this.res.images[Const.RED1],
            this.res.images[Const.RED2],
            this.res.images[Const.ORG1],
            this.res.images[Const.ORG2],
            this.res.images[Const.PIN1],
            this.res.images[Const.PIN2],
            this.res.images[Const.BMB1],
            this.res.images[Const.BMB2]
        );
        this.bonus = new Bonus(this.res.images[Const.FRU1], this.res.images[Const.FRU2]);
        this.reset();
    }

    reset() {
        this.score = 0;
        this.gameOverTime = 3;
        this.state = Const.START;
    }

    draw() {
        const img = this.res.images[Const.BACK];
        this.ctx.drawImage(img, this.backPos, 0);
        this.ctx.drawImage(img, this.backPos + img.width, 0);
        this.stars.draw(this.ctx);

        switch (this.state) {
            case Const.START:
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.font = "50px 'Ubuntu Mono'";
                this.ctx.fillText(`SCORE: ${this.score}`, Const.WIDTH >> 1, Const.HEIGHT * .4);
                this.ctx.fillText(`BEST: ${this.hiscore}`, Const.WIDTH >> 1, Const.HEIGHT * .55);
                this.ctx.font = "30px 'Ubuntu Mono'";
                this.ctx.fillText("CLICK TO PLAY", Const.WIDTH >> 1, Const.HEIGHT * .9);
                break;
            case Const.GAME:
                this.ctx.fillStyle = "white";
                this.ctx.font = "20px 'Ubuntu Mono'";
                this.ctx.textAlign = "right";
                this.ctx.fillText(`SCORE: ${this.score}`, Const.WIDTH - 10, 20);
                this.ctx.textAlign = "left";
                this.ctx.fillText(`SHIELD: ${this.player.shield}`, 10, 20);
                this.ctx.fillText(`BOMBS: ${this.player.bombs}`, 10, 40);
                this.enemies.draw(this.ctx);
                this.bonus.draw(this.ctx);
                this.player.draw(this.ctx);
                break;
            case Const.OVER:
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.font = "80px 'Ubuntu Mono'";
                this.ctx.fillText("GAME OVER!", Const.WIDTH >> 1, Const.HEIGHT * .56);
                break;
        }
        this.xplo.draw(this.ctx);
    }

    update(dt) {
        if ((this.backPos -= dt * 10) < -this.res.images[Const.BACK].width) this.backPos = 0;
        this.stars.update(dt);
        this.xplo.update(dt);
        switch (this.state) {
            case Const.START:
                break;
            case Const.GAME:
                this.player.update(dt);
                if (this.player.shield < 0) {
                    this.state = Const.OVER;
                }
                this.enemies.update(dt);
                this.bonus.update(dt);
                this.testCollision();
                if ((this.scoreTime -= dt) < 0) {
                    this.scoreTime = .95;
                    this.score += 1;
                }
                break;
            case Const.OVER:
                if ((this.gameOverTime -= dt) < 0) {
                    if (this.score > this.hiscore) {
                        this.hiscore = this.score;
                    }
                    this.state = Const.START;
                }
                break;
        }
    }

    testCollision() {
        function collided(a, b) {
            return !(((a.b < b.t) || (a.t > b.b) || (a.r < b.l) || (a.l > b.r)));
        }

        const bx = this.player.box;
        for (let f of this.bonus.fruits) {
            if (!f.alive) continue;
            if (collided(f.box, bx)) {
                f.alive = false;
                this.xplo.startStar(f.pos.x, f.pos.y, .25);
                if (f.type === 0) {
                    this.player.defense(5);
                    this.snd.play(4);
                    if ((++this.player.bombs) > 5) this.player.bombs = 5;
                    this.score += 2;
                } else {
                    this.snd.play(3);
                    this.player.defense(10);
                    this.score += 1;
                }
            }
        }
        for (let f of this.enemies.enemies) {
            if (!f.alive) continue;
            if (collided(f.box, bx)) {
                f.alive = false;
                this.xplo.startExplosion(f.pos.x, f.pos.y, .25, f.clr);
                this.playHit();
                let d = 30;
                if (f.isBomb) d = 55;
                this.player.defense(-d);
                if (this.player.shield < 0) {
                    this.xplo.startExplosion(this.player.pos.x, this.player.pos.y, .5, "#f3e600");
                    this.snd.play(5);
                }
            }
        }
    }

    playHit() {
        for (let z = 0; z < 2; z++) {
            if (!this.snd.isPlaying(z)) {
                this.snd.play(z);
                return;
            }
        }
    }
}
new Flapypac();