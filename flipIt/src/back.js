import * as Const from "./const.js"
import Point from "./point.js";

class Line {
    constructor() {
        this.pos = new Point();
        this.speed;
        this.hei;
        this.wid;
        this.alpha;
    }

    start(y) {
        this.pos.set(Math.random() * Const.WIDTH, y);
        this.wid = Math.random() * 10 + 2;
        this.hei = Math.random() * 60 + 45;
        this.speed = Math.random() * 50 + 1;
        this.alpha = (Math.random() * 6 + 1) / 10;
    }

    update(dt) {
        this.pos.y += dt * this.speed;
        if (this.pos.y > Const.HEIGHT) {
            this.start(-(Math.random() * Const.HEIGHT + 150));
        }
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.lineWidth = this.wid;
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x, this.pos.y + this.hei);
        ctx.stroke();
    }
}

export default class Background {
    constructor() {
        this.lines = [];
        for (let z = 0; z < 30; z++) {
            const l = new Line();
            l.start(Math.random() * Const.HEIGHT);
            this.lines.push(l)
        }
    }

    update(dt) {
        for (let s of this.lines) {
            s.update(dt);
        }
    }

    draw(ctx) {
        ctx.strokeStyle = "#040"; //"white";
        ctx.lineCap = "round";
        for (let s of this.lines) {
            s.draw(ctx);
        }
        ctx.globalAlpha = 1;
    }
}