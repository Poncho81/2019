import Point from "./point.js"
import * as Const from "./const.js"

class Particle {
    constructor() {
        this.alive = false;
        this.pos = new Point();
        this.vel = new Point();
        this.ang;
        this.alpha;
        this.spd;
        this.dir;
        this.image;
        this.wid;
        this.hei;
    }

    start(x, y, img) {
        this.ang = Math.random() * Const.TWO_PI;
        this.pos.set(x, y);
        this.vel.set(Math.cos(this.ang), Math.sin(this.ang));
        this.alpha = 1;
        this.spd = Math.random() * 20 + 20;
        this.dir = Math.random() < .5 ? -1 : 1;
        this.alive = true;
        this.image = img;
        this.wid = img.width;
        this.hei = img.height;
    }

    draw(ctx) {
        const w = this.wid >> 1,
            h = this.hei >> 1;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.left + w, this.top + h)
        ctx.rotate(this.ang)
        ctx.drawImage(this.image, -w, -h);
        ctx.restore();
    }

    update(dt) {
        if ((this.alpha -= dt) < 0) {
            this.alive = false;
            return;
        }
        this.ang += dt;
        if (this.ang > Const.TWO_PI) this.ang = 0;
        const d = this.dir * this.spd * dt;
        this.pos.x += this.vel.x * d;
        this.pos.y += this.vel.y * d;
    }

    get left() {
        return this.pos.x - (this.wid >> 1);
    }

    get top() {
        return this.pos.y - (this.hei >> 1);
    }
}

export default class Particles {
    constructor(res) {
        this.res = res;
        this.stars = [];
        for (let t = 0; t < 400; t++) {
            this.stars.push(new Particle());
        }
    }

    getParticle() {
        for (let t = 0, l = this.stars.length; t < l; t++) {
            if (!this.stars[t].alive) return this.stars[t];
        }
        return null;
    }

    start(x, y) {
        const r = Math.random() * 3 + 1;
        for (let t = 0; t < r; t++) {
            const s = this.getParticle();
            if (!s) return;
            s.start(x, y, Math.random() < .5 ? this.res.images[Const.S] : this.res.images[Const.T]);
        }
    }

    draw(ctx) {
        for (let s of this.stars) {
            if (s.alive) s.draw(ctx);
        }
    }

    update(dt) {
        for (let s of this.stars) {
            if (s.alive) s.update(dt);
        }
    }
}