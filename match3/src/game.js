import * as Const from "./const.js";

export default class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.width = this.canvas.height = Const.BRD_SIZE * Const.SCALE;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(Const.SCALE, Const.SCALE);
    document.body.appendChild(this.canvas);
    this.res = new Resource();
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
      this.ctx.clearRect(0, 0, Const.BRD_SIZE, Const.BRD_SIZE);
      this.draw();
      requestAnimationFrame(this.loop);
    }
  }
}

class Resource {
  constructor() {
    this.images;
  }

  loadImages(path, callback) {
    let idx = 0;
    const promises = [];
    this.images = new Array(path.length);
    path.forEach(f => promises.push(this.loadImage(`../img/${f}`)));
    Promise.all(promises).then((res) => {
      res.forEach(img => this.images[Const.N01 + idx++] = img);
    }).then(() => callback());
  }

  loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve(img);
    });
  }
}