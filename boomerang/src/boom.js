import * as Const from "./const.js";
import Entity from "./entity.js";

export default class Boom extends Entity {
    constructor(img) {
        super(img);
        this.ang;
        this.angX;
        this.startX;
        this.collide;
    }

    start(x, y) {
        this.pos.set(x, y);
        this.alive = true;
        this.ang = 0;
        this.angX = 0;
        this.collide = false;
        this.startX = x + 30;
    }

    update(dt) {
        if ((this.ang += dt * 16) > Const.TWO_PI) this.ang = 0;
        this.pos.x += Math.cos(this.angX) * 320 * dt;
        if ((this.angX += dt) > Const.TWO_PI) this.angX = 0;
        if (this.pos.x > this.startX) this.collide = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.ang);
        ctx.drawImage(this.img, -this.wid >> 1, -this.hei >> 1);
        ctx.restore();

        /*ctx.beginPath();
        ctx.moveTo(this.left, this.top);
        ctx.lineTo(this.right, this.top);
        ctx.lineTo(this.right, this.bottom);
        ctx.lineTo(this.left, this.bottom);
        ctx.closePath();
        ctx.stroke();*/
    }
}