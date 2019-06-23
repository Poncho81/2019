import Entity from "./entity.js";
import * as Const from "./const.js";

class Enemy extends Entity {
  constructor(img) {
    super(img);
    this.type;
    this.dir;
    this.dirR;
    this.speed;
    this.yAng = 0;
    this.ang = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.ang);
    ctx.drawImage(this.img, -this.wid >> 1, -this.hei >> 1);
    ctx.restore();

    /*ctx.beginPath();
    ctx.moveTo(this.left, this.top);
    ctx.lineTo(this.right, this.top);
    ctx.lineTo(this.right, this.bottom);
    ctx.lineTo(this.left, this.bottom);
    ctx.closePath();
    ctx.stroke();*/
  }

  update(dt) {
    switch (this.type) {
      case Const.FLYER:
        this.pos.x += dt * this.speed * this.dir;
        this.pos.y += Math.cos(this.yAng) * 15 * dt;
        if ((this.yAng += dt) > Const.TWO_PI) this.yAng = 0;

        this.ang += dt * this.dirR;
        if (Math.abs(this.ang) > .3) {
          this.dirR = -this.dirR;
        }
        break;
      case Const.WALKER:
        break;
    }

    if (this.dir > 0) {
      if (this.pos.x > Const.WIDTH + this.wid) this.alive = false;
    } else {
      if (this.pos.x < -this.wid) this.alive = false;
    }
  }
}

export default class Enemies {
  constructor(imgf, imgb) {
    this.img = [imgf, imgb];
    this.spawnTime = 3;
    this.enemies = [];
    for (let e = 0; e < 20; e++) {
      this.enemies.push(new Enemy());
    }
  }

  reset() {
    this.spawnTime = 3;
    for (let e = 0; e < 20; e++) {
      this.enemies[e].alive = false;
    }
  }

  startNewEnemy() {
    const e = this.getEnemy();
    if (!e) return;
    e.alive = true;
    e.dir = Math.random() < .5 ? -1 : 1;
    e.speed = Math.random() * 60 + 90;

    if (e.dir < 0) {
      e.pos.set(Const.WIDTH + 50, Math.random() * 130 + 210);
      e.dirR = .25;
    } else {
      e.pos.set(-50, Math.random() * 130 + 210);
      e.dirR = -.25;
    }

    e.type = Const.FLYER;
    e.setImage(e.dir > 0 ? this.img[0] : this.img[1]);

    /*if (Math.random() > .5) {
      e.setImage(this.img[0]);
      e.type = Const.FLYER;
    } else {
      e.setImage(this.img[1]);
      e.type = Const.FLYER;
    }*/
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
        /*if (Math.random() < .001) {
          e.dir = -e.dir;
          e.setImage(e.dir > 0 ? this.img[0] : this.img[1]);
        }*/
      }
    }

    if ((this.spawnTime -= dt) < 0) {
      this.spawnTime = 3;
      this.startNewEnemy();
    }
  }

  draw(ctx) {
    for (let e of this.enemies) {
      if (e.alive) e.draw(ctx);
    }
  }
}