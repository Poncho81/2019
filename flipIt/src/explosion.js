import * as Const from "./const.js";
import Particles from "./particles.js";
import Point from "./point.js";

export default class Explosion {
    constructor() {
        this.parts = new Particles();
        this.pos = new Point();
        this.s1 = 10;
        this.alpha1 = .7;
    }

    reset() {
        this.s1 = 10;
        this.alpha1 = .7;
    }

    start(x, y) {
        this.pos.set(x, y);
        this.parts.start(x, y);
    }

    update(dt) {
        this.parts.update(dt);
        this.alpha1 -= dt * .65;
        this.s1 += dt * 80;
        return this.alpha1 < 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 15;
        ctx.strokeStyle = "red"; //"#6239ae";
        ctx.globalAlpha = this.alpha1;
        ctx.arc(this.pos.x, this.pos.y, this.s1, 0, Const.TWO_PI);
        ctx.stroke();
        ctx.restore();
        this.parts.draw(ctx);
    }
}