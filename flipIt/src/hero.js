import * as Const from "./const.js"
import Point from "./point.js";

export default class Hero {
    constructor(l, r) {
        this.imgL = l;
        this.imgR = r;
        this.x;
        this.y = Const.HEIGHT * .7;
        this.right = true;
        this.wid = this.imgL.width;
        this.hei = this.imgL.height;
    }

    get mid() {
        return new Point(this.x + (this.wid >> 1), this.y + (this.hei >> 1));
    }

    draw(ctx) {
        this.x = this.right ? (Const.WIDTH >> 1) - 47 : (Const.WIDTH >> 1) + 20;
        ctx.drawImage(this.right ? this.imgL : this.imgR, this.x, this.y);
    }

    jump() {
        this.right = !this.right;
    }

    get box() {
        return {
            t: this.y,
            l: this.x,
            r: this.x + this.wid,
            b: this.y + this.hei
        };
    }
}