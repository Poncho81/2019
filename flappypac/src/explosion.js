import Point from "./point.js";
import * as Const from "./const.js";

class Particle {
  constructor() {
    this.size = new Point();
    this.grow = new Point();
    this.pos = new Point();
    this.vel = new Point();
    this.velD = new Point();
    this.clr;
    this.alpha = 1;
    this.alive = false;
  }

  update(dt) {
    if ((this.alpha -= dt) < 0) {
      this.alive = false;
      return;
    }
    this.size.x += this.grow.x * dt;
    this.size.y += this.grow.y * dt;
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.vel.x -= this.velD.x * dt;
    this.vel.y -= this.velD.y * dt;
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.clr;
    ctx.fillRect(this.pos.x - (this.size.x >> 1), this.pos.y - (this.size.y >> 1), this.size.x, this.size.y);
  }
}

class Particles {
  constructor() {
    this.particles = [];
    for (let d = 0; d < 1500; d++) {
      this.particles.push(new Particle());
    }
  }

  start(x = 0, y = 0, vx = 0, vy = 0, gx = 0, gy = 0, sx = 1, sy = 1, vdx = 0, vdy = 0, clr) {
    for (let d = 0, len = this.particles.length; d < len; d++) {
      const p = this.particles[d];
      if (!p.alive) {
        p.alpha = 1;
        p.clr = clr;
        p.alive = true;
        p.pos.set(x, y);
        p.vel.set(vx, vy);
        p.velD.set(vdx, vdy);
        p.grow.set(gx, gy);
        p.size.set(sx, sy);
        return;
      }
    }
  }

  update(dt) {
    this.particles.forEach(el => {
      if (el.alive) el.update(dt);
    });
  }

  draw(ctx) {
    this.particles.forEach(el => {
      if (el.alive) el.draw(ctx);
    });
  }
}

class Explo {
  constructor() {
    this.pos = new Point();
    this.time;
    this.next;
    this.clr;
  }
}

export default class Explosion {
  constructor() {
    this.particles = new Particles();
    this.explo = [];
    for (let r = 0; r < 100; r++) {
      this.explo.push(new Explo());
    }
  }

  startParts(x, y) {
    const q = Math.random() * Const.TWO_PI,
      vx = Math.random() * 5 + 5,
      s = Math.random() * 4 + 2;
    this.particles.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 1, 1, s, s);
  }

  startStar(x, y) {
    for (let a = 0; a < 15; a++) {
      const q = Math.random() * Const.TWO_PI,
        vx = Math.random() * 50 + 15,
        s = Math.random() * 4 + 2;
      this.particles.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 1, 1, s, s, 0, 0, "#f00");
    }
  }

  startExplosion(x = 0, y = 0, tm = 0, clr) {
    for (let a = 0; a < 80; a++) {
      const q = Math.random() * Const.TWO_PI,
        vx = Math.random() * 50 + 25,
        s = Math.random() * 3 + 2;
      this.particles.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 1, 1, s, s, 0, 0, clr);
    }

    for (let d = 0, len = this.explo.length; d < len; d++) {
      const p = this.explo[d];
      if (!p.alive) {
        p.alive = true;
        p.clr = clr;
        p.next = 0;
        p.pos.set(x, y);
        p.time = tm;
        return;
      }
    }
  }

  update(dt) {
    let ret = false;
    this.explo.forEach(el => {
      if (el.alive) {
        ret = true;
        if ((el.next -= dt) < 0) {
          el.next = .03;
          const q = Math.random() * Const.TWO_PI,
            vx = Math.random() * 10 + 10,
            gx = Math.random() * 16 + 4,
            sx = Math.random() * 12 + 4;
          this.particles.start(el.pos.x + vx * Math.cos(q), el.pos.y + vx * Math.sin(q), 0, 0, gx, gx, sx, sx, 0, 0, el.clr);
        }
        if ((el.time -= dt) < 0) {
          el.alive = false;
        }
      }
    });

    this.particles.update(dt);
    return ret;
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    this.particles.draw(ctx);
    ctx.globalAlpha = 1;
  }
}