import Entity from "./entity.js";
import * as Const from "./const.js";

class Enemy extends Entity {
  constructor() {
    super(2);
    this.anim = [0, 1];
    this.isBomb;
    this.dir;
    this.ySpeed;
    this.clr;
    this.animTime = this.animWaitTime = .25;
  }

  update(dt) {
    super.update(dt);

    this.pos.x += this.speed * dt;
    if (this.pos.x < -this.getBmp().wid) {
      this.alive = false;
      return;
    }
    if (this.isBomb) {
      this.pos.y += this.dir * this.ySpeed * dt;
      if (this.bottom > Const.HEIGHT || this.top < 0) {
        this.dir = -this.dir;
      }
    } else {
      this.pos.y += Math.cos(this.angle) * 15 * dt;
      if ((this.angle += dt) > Const.TWO_PI) this.angle = 0;
    }
  }
}

export default class Enemies {
  constructor(b1, b2, r1, r2, o1, o2, p1, p2, m1, m2) {
    this.img = [b1, b2, r1, r2, o1, o2, p1, p2, m1, m2];
    this.enemies = [];
    this.startEnemy;
    this.startBmb;
    for (let x = 0; x < 50; x++) {
      this.enemies.push(new Enemy());
    }
    this.reset();
  }

  reset() {
    for (let e of this.enemies) {
      e.alive = false;
    }
    this.startEnemy = .8;
    this.startBmb = 6 + Math.random() * 6;
    this.ghosts = [0, 2, 4, 6];
  }

  startNewEnemy(bmb) {
    const e = this.getEnemy(),
      clr = ["#00ace6", "#00ace6", "#ff0000", "#ff0000",
        "#ff6600", "#ff6600", "#ff49fe", "#ff49fe"
      ];
    if (!e) return;
    e.speed = -(Math.random() * 90 + 60);
    e.isBomb = bmb;
    e.alive = true;
    e.angle = Math.random() * Const.TWO_PI;
    let img;
    if (bmb) {
      img = this.img[8];
      e.addImage(img);
      e.addImage(this.img[9]);
      e.clr = "#0558f4";
    } else {
      const a = Math.floor(Math.random() * this.ghosts.length),
        z = this.ghosts[a];
      this.ghosts.splice(a, 1);
      if (this.ghosts.length < 1) {
        this.ghosts = [0, 2, 4, 6];
      }
      img = this.img[z];
      e.addImage(img);
      e.addImage(this.img[z + 1]);
      e.clr = clr[z];
    }
    e.pos.set(Const.WIDTH + img.width, Math.random() * (Const.HEIGHT - 30) + 15);
    e.dir = e.pos.y > (Const.HEIGHT >> 1) ? -1 : 1;
    e.ySpeed = Math.random() * 50 + 90;
  }

  getEnemy() {
    for (let e of this.enemies) {
      if (!e.alive) return e;
    }
    return null;
  }

  update(dt) {
    for (let e of this.enemies) {
      if (e.alive) {
        e.update(dt);
      }
    }
    if ((this.startEnemy -= dt) < 0) {
      this.startEnemy = 1;
      this.startNewEnemy(false);
    }
    if ((this.startBmb -= dt) < 0) {
      this.startBmb = 6 + Math.random() * 6;
      this.startNewEnemy(true);
    }
  }

  draw(ctx) {
    for (let e of this.enemies) {
      if (e.alive)
        e.draw(ctx);
    }
  }
}