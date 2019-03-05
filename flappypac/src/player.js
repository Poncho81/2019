import * as Const from "./const.js";
import Entity from "./entity.js";

export default class Player extends Entity {
  constructor(i1, i2, i3) {
    super(3);
    this.addImage(i1);
    this.addImage(i2);
    this.addImage(i3);
    this.anim = [0, 1, 2, 1];
    this.animTime = this.animWaitTime = .12;
    this.jumpPower;
    this.jumping;
    this.shield;
    this.bombs;
    this.reset();
  }

  reset() {
    this.pos.set(110, 180);
    this.shield = 100;
    this.jumping = false;
    this.bombs = 0;
    this.jumpPower = 0;
  }

  update(dt) {
    super.update(dt);

    if (this.jumping) {
      const z = this.jumpPower * dt * 3;
      this.pos.y += z;
      if (this.bottom < 0) {
        this.defense(-1);
      }
      if ((this.jumpPower += Const.GRAVITY * dt * 2) > 0) {
        this.jumping = false;
      }
    } else {
      this.pos.y += Const.GRAVITY * dt;
      if (this.top > Const.HEIGHT) {
        this.defense(-1);
      }
    }
    return true;
  }

  jump() {
    if (this.jumpPower < -40) return;
    this.jumpPower = -90;
    this.jumping = true;
  }

  defense(r) {
    this.shield += r;
    if (this.shield > 100) this.shield = 100;
  }
}