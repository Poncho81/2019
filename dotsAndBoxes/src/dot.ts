import * as Const from "./const.js";
import Point from "./point.js";

export default class Dot {
  pos: Point;
  color: string;

  constructor(pt: Point) {
    this.pos = new Point(pt.x, pt.y);
    this.color = "rgba(200, 200, 200, 1)";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, Const.DOT, 0, 2 * Math.PI);
    ctx.fill();
  }
}