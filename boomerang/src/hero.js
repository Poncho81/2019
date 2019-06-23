import * as Const from "./const.js";
import Entity from "./entity.js";
import Boom from "./boom.js"

export default class Hero extends Entity {
  constructor(img, boom, expl) {
    super(img);
    this.explo = expl;
    this.jumpPower;
    this.jumping = true;
    this.boomWait = 0;
    this.boomis = [];
    for (let r = 0; r < 50; r++) {
      this.boomis.push(new Boom(boom));
    }

    this.reset();
  }

  reset() {
    for (let r = 0; r < 50; r++) {
      this.boomis[r].alive = false;
    }

    this.jumping = true;
    this.pos.set(396, -40);
    this.jumpPower = 200;
  }

  update(dt) {
    this.boomWait -= dt;

    if (this.jumping) {
      this.pos.y += this.jumpPower * 2.8 * dt;
      this.jumpPower += Const.GRAVITY * dt * 5;
      if (this.pos.y > 350) {
        this.jumping = false;
        this.pos.y = 350;
      }
    }

    for (let b of this.boomis) {
      if (b.alive) b.update(dt);
    }
  }

  draw(ctx) {
    super.draw(ctx);
    for (let b of this.boomis) {
      if (b.alive) {
        if (this.boomWait < 0)
          this.explo.startParts(b.pos.x, b.pos.y)
        b.draw(ctx);
      }
    }
    if (this.boomWait < 0) this.boomWait = .025;
  }

  jump() {
    if (this.jumping) return;
    this.jumpPower = -270;
    this.jumping = true;
  }

  getBoom() {
    for (let b of this.boomis) {
      if (!b.alive) return b;
    }
    return null;
  }

  shoot() {
    const b = this.getBoom();
    if (!b) return;
    b.start(this.pos.x, this.pos.y);
  }
}