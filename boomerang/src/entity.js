import Point from "./point.js";

export default class Entity {
  constructor(img) {
    this.pos = new Point();
    this.alive = false;
    this.img = null;
    this.wid = this.hei = 0;
    if (img) this.setImage(img);
  }

  setImage(img) {
    this.img = img;
    this.wid = img.width;
    this.hei = img.height;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.left, this.top);

    /*ctx.beginPath();
    ctx.moveTo(this.left, this.top);
    ctx.lineTo(this.right, this.top);
    ctx.lineTo(this.right, this.bottom);
    ctx.lineTo(this.left, this.bottom);
    ctx.closePath();
    ctx.stroke();*/
  }

  get left() {
    return this.pos.x - (this.wid >> 1);
  }

  get right() {
    return this.pos.x + (this.wid >> 1);
  }

  get top() {
    return this.pos.y - (this.hei >> 1);
  }

  get bottom() {
    return this.pos.y + (this.hei >> 1);
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