import * as Const from "./const.js";
import Game from "./game.js"
import Resources from "./resources.js";
import Hero from "./hero.js";
import Wolken from "./wolken.js";
import Explosion from "./explosion.js";
import Enemies from "./enemies.js";
import Sound from "./sound.js";

class Boomy extends Game {
    constructor() {
        super();
        this.state = Const.WAIT;
        this.gameOver;
        this.score;
        this.hiscore = 0;
        this.explosion = new Explosion();
        this.sound = new Sound([
            "../snd/01.ogg", "../snd/02.ogg", "../snd/03.ogg",
            "../snd/04.ogg", "../snd/05.ogg", "../snd/06.ogg",
            "../snd/07.ogg", "../snd/08.ogg", "../snd/09.ogg"
        ], .2);
        this.res = new Resources(() => {
            this.wolken = new Wolken(this.res.images[Const.W1], this.res.images[Const.W2], this.res.images[Const.W3]);
            this.hero = new Hero(this.res.images[Const.HR], this.res.images[Const.BM], this.explosion);
            this.baddies = new Enemies(this.res.images[Const.BL], this.res.images[Const.BR]);
            this.reset();
            this.loop();
        });

        window.addEventListener("keydown", (e) => {
            if (this.gameOver && e.keyCode === 32) {
                this.reset();
                this.hero.reset();
                this.baddies.reset();
                return;
            }
            switch (this.state) {
                case Const.WAIT:
                    if (e.keyCode === 32) {
                        this.sound.playLoop(Math.floor(Math.random() * 8), this.callBack);
                        this.reset();
                        this.state = Const.PLAY;
                    }
                    break;
                case Const.PLAY:
                    if (e.keyCode === 38) {
                        this.hero.jump();
                    }
                    if (e.keyCode === 17) {
                        this.hero.shoot();
                    }
                    break;
            }

        }, false);
    }

    reset() {
        this.score = 0;
        this.gameOver = false;
    }

    draw() {
        this.ctx.drawImage(this.res.images[Const.BK], 0, 0);
        this.wolken.draw(this.ctx);
        this.explosion.draw(this.ctx);
        this.ctx.drawImage(this.res.images[Const.GR], 0, Const.HEIGHT - 69);

        if (this.gameOver) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#34474d";
            this.ctx.font = "34px 'Press Start 2P'";
            this.ctx.fillText(`KILLS: ${this.score}`, Const.WIDTH >> 1, Const.HEIGHT * .4);
            this.ctx.fillText(`BEST: ${this.hiscore}`, Const.WIDTH >> 1, Const.HEIGHT * .5);
            this.ctx.fillStyle = "gold";
            this.ctx.font = "12px 'Press Start 2P'";
            this.ctx.fillText(`PRESS SPACE TO PLAY`, Const.WIDTH >> 1, Const.HEIGHT * .95);
        } else {
            this.hero.draw(this.ctx);
            this.baddies.draw(this.ctx);
            this.ctx.fillStyle = "#34474d";
            this.ctx.textAlign = "left";
            this.ctx.font = "16px 'Press Start 2P'";
            this.ctx.fillText(`KILLS: ${this.score}`, 10, 30);
            this.ctx.textAlign = "right";
            this.ctx.fillText(`BEST: ${this.hiscore}`, Const.WIDTH - 10, 30);
            if (this.state === Const.WAIT) {
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "gold";
                this.ctx.font = "12px 'Press Start 2P'";
                this.ctx.fillText(`PRESS SPACE TO PLAY`, Const.WIDTH >> 1, Const.HEIGHT * .95);
            }
        }
    }

    collided(a, b) {
        return !(((a.b < b.t) || (a.t > b.b) || (a.r < b.l) || (a.l > b.r)));
    }

    update(dt) {
        this.wolken.update(dt);
        this.explosion.update(dt);
        if (this.state != Const.PLAY) return;
        this.baddies.update(dt);
        if (this.gameOver) {
            //
        } else {
            this.hero.update(dt);
            const pb = this.hero.box;

            for (let b = 0, l = this.hero.boomis.length; b < l; b++) {
                const bm = this.hero.boomis[b];
                if (bm.alive) {
                    if (bm.collide && this.collided(pb, bm.box)) {
                        this.hero.alive = bm.alive = false;
                        this.explosion.startExplosion(this.hero.pos.x, this.hero.pos.y, .8);
                        this.gameOver = true;
                        return;
                    }
                }
            }

            for (let l = this.baddies.enemies.length - 1, e = l; e > -1; e--) {
                const en = this.baddies.enemies[e];
                if (en.alive) {
                    const eb = en.box;
                    for (let b = 0, l = this.hero.boomis.length; b < l; b++) {
                        const bm = this.hero.boomis[b];
                        if (bm.alive && this.collided(bm.box, eb)) {
                            en.alive = bm.alive = false;
                            this.explosion.startExplosion(en.pos.x, en.pos.y, .6);
                            this.score++;
                            if (this.score > this.hiscore) {
                                this.hiscore = this.score;
                            }
                        }
                    }
                    if (this.collided(pb, eb)) {
                        this.hero.alive = en.alive = false;
                        this.explosion.startExplosion(this.hero.pos.x, this.hero.pos.y, .8);
                        this.gameOver = true;
                        return;
                    }
                }
            }
        }
    }
}
new Boomy();