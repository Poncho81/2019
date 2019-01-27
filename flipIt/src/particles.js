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
        this.color;
        this.size;
        this.colors = ["#f00", "#000", "#f00", "#f00", "#f00", "#000", "#f00", "#000", "#f00", "#f00", "#f00", "#f00"];
    }

    start(x, y) {
        this.ang = Math.random() * Const.TWO_PI;
        this.pos.set(x, y);
        this.vel.set(Math.cos(this.ang), Math.sin(this.ang));
        this.alpha = 1;
        this.spd = Math.random() * 60 + 40;
        this.dir = Math.random() < .5 ? -1 : 1;
        this.alive = true;
        this.size = Math.random() * 4 + 2;
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    draw(ctx) {
        const w = this.size >> 1,
            h = this.size >> 1;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.left + w, this.top + h)
        ctx.rotate(this.ang)
        ctx.fillRect(-w, -h, this.size, this.size);
        ctx.restore();
    }

    get left() {
        return this.pos.x - (this.size >> 1);
    }

    get top() {
        return this.pos.y - (this.size >> 1);
    }

    update(dt) {
        if ((this.alpha -= dt * .9) < 0) {
            this.alive = false;
            return;
        }
        this.ang += dt;
        if (this.ang > Const.TWO_PI) this.ang = 0;
        const d = this.dir * this.spd * dt;
        this.pos.x += this.vel.x * d;
        this.pos.y += this.vel.y * d;
    }
}

export default class Particles {
    constructor() {
        this.parts = [];
        for (let t = 0; t < 300; t++) {
            this.parts.push(new Particle());
        }
    }

    start(x, y) {
        for (let s of this.parts) {
            s.start(x, y);
        }
    }

    draw(ctx) {
        for (let s of this.parts) {
            if (s.alive) s.draw(ctx);
        }
    }

    update(dt) {
        for (let s of this.parts) {
            if (s.alive) s.update(dt);
        }
    }
}