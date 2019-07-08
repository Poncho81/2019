import * as Const from "./const.js"
import Point from "./point.js"

export default class Tile {
  constructor(t, x, y, bx, by) {
    this.type = t;
    this.pixelPos = new Point(x, y);
    this.gridPos = new Point(bx, by);
    this.vel = new Point();
    this.target = new Point();
    this.alpha = 1;
    this.alive = true;
    this.blocked = false;
    this.flash = false;
    this.selected = false;
    this.moving = false;
    this.hiding = false;
  }

  moveTo(x, y, vx, vy) {
    this.moving = true;
    this.vel.set(vx, vy);
    this.target.set(x, y);
  }

  select(sel) {
    this.selected = sel;
  }

  update(dt) {
    if (this.hiding) {
      if ((this.alpha -= dt * 4) < 0) {
        this.hiding = false;
        this.alive = false;
      }
      return this.hiding;
    }

    if (this.moving) {
      this.pixelPos.x += this.vel.x * dt * Const.SPEED;
      this.pixelPos.y += this.vel.y * dt * Const.SPEED;
      if (this.pixelPos.dist(this.target) < 1) {
        this.pixelPos.set(this.target.x, this.target.y);
        this.moving = false;
      }
    }
    return this.moving;
  }

  get left() {
    return this.pixelPos.x - Const.HSIZE;
  }

  get right() {
    return this.pixelPos.x + Const.HSIZE;
  }

  get top() {
    return this.pixelPos.y - Const.HSIZE;
  }

  get bottom() {
    return this.pixelPos.y + Const.HSIZE;
  }
}