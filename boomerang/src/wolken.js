import * as Const from "./const.js";
import Point from "./point.js";

class Wolke {
  constructor(img, x, y) {
    this.pos = new Point();
    this.speed;
    this.reset(img, x, y);
  }

  reset(img, x, y) {
    this.pos.set(x, y);
    this.speed = Math.random() * 10 + 16;
    this.img = img;
    this.wid = img.width;
  }

  update(dt) {
    this.pos.x -= dt * this.speed;
    if (this.pos.x < -this.wid) {
      return false;
    }
    return true;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y);
  }
}

export default class Wolken {
  constructor(im1, im2, im3) {
    this.img = [im1, im2, im3];
    this.wolken = [];

    let x = Math.random() * Const.WIDTH - 300;
    this.wolken.push(new Wolke(this.img[Math.floor(Math.random() * 3)], x, Math.random() * 60 + 10));
    for (let w = 1; w < 6; w++) {
      x += Math.random() * 100 + 250;
      this.wolken.push(new Wolke(this.img[Math.floor(Math.random() * 3)], x, Math.random() * 60 + 10));
    }
  }

  update(dt) {
    for (let w of this.wolken) {
      if (!w.update(dt)) {
        this.wolken.sort((a, b) => {
          return a.pos.x - b.pos.x;
        });
        const x = this.wolken[this.wolken.length - 1].pos.x + Math.random() * 100 + 250;
        w.reset(this.img[Math.floor(Math.random() * 3)], x, Math.random() * 60 + 10);
      }
    }
  }

  draw(ctx) {
    for (let w of this.wolken) {
      if (w.pos.x < Const.WIDTH + 5) {
        w.draw(ctx)
      }
    }
  }
}