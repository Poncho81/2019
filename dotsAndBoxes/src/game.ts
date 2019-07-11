import * as Const from "./const.js";

export default class Game {
  draw() {
    throw new Error("Method not implemented.");
  }
  update(arg0: number) {
    throw new Error("Method not implemented.");
  }
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastTime: number;
  accumulator: number;
  deltaTime: number;
  zu: number;
  loop: (time: any) => void;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.width = this.canvas.height = Const.BRD_SIZE * Const.SCALE;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(Const.SCALE, Const.SCALE);
    document.getElementById("game").appendChild(this.canvas);
    this.lastTime = 0;
    this.accumulator = 0;
    this.deltaTime = 1 / 500;
    this.loop = (time) => {
      this.accumulator += (time - this.lastTime) / 1000;
      while (this.accumulator > this.deltaTime) {
        this.accumulator -= this.deltaTime;
        this.update(Math.min(this.deltaTime, .5));
      }
      this.lastTime = time;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
      requestAnimationFrame(this.loop);
    }
  }
}