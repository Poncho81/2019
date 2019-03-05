import Point from "./point.js";
import BMP from "./bmp.js";

export default class Entity {
  constructor(frameCnt) {
    this.pos = new Point();
    this.alive = false;
    this.frameCnt = frameCnt;
    this.animTime;
    this.animWaitTime;
    this.speed;
    this.angle;
    this.frame = 0;
    this.anim = [];
    this.bmp = [];
  }

  update(dt) {
    if ((this.animTime -= dt) < 0) {
      this.animTime = this.animWaitTime;
      this.frame = (this.frame + 1) % this.anim.length;
    }
  }

  addImage(bmp) {
    if (this.bmp.length === this.frameCnt) this.bmp = [];
    this.bmp.push(new BMP(bmp));
  }

  draw(ctx) {
    const i = this.getBmp().img;
    ctx.drawImage(i, this.left, this.top);

    /*ctx.beginPath();
    ctx.moveTo(this.left, this.top);
    ctx.lineTo(this.right, this.top);
    ctx.lineTo(this.right, this.bottom);
    ctx.lineTo(this.left, this.bottom);
    ctx.closePath();
    ctx.stroke();*/
  }

  getBmp() {
    return this.bmp[this.anim[this.frame]];
  }

  get left() {
    return this.pos.x - (this.getBmp().wid >> 1);
  }

  get right() {
    return this.pos.x + (this.getBmp().wid >> 1);
  }

  get top() {
    return this.pos.y - (this.getBmp().hei >> 1);
  }

  get bottom() {
    return this.pos.y + (this.getBmp().hei >> 1);
  }

  get box() {
    return {
      l: this.left,
      r: this.right,
      t: this.top,
      b: this.bottom
    };
  }
}