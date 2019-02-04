import * as Const from "./const.js"
import Point from "./point.js";
import Box from "./box.js";

export default class Background {
    constructor() {
        this.cnvLeft = document.createElement("canvas");
        this.cnvRight = document.createElement("canvas");
        this.cnvLeft.width = this.cnvRight.width = Const.WIDTH >> 1;
        this.cnvLeft.height = this.cnvRight.height = 300;
        this.left = 0;
        this.right = 230;
        this.boxes = [new Box(), new Box()];
        this.lftPt = new Point();
        this.rgtPt = new Point();
    }

    start(clr = 0) {
        const cw = this.cnvLeft.width,
            ch = this.cnvLeft.height,
            ctx1 = this.cnvLeft.getContext("2d"),
            ctx2 = this.cnvRight.getContext("2d"),
            w = Math.random() * 130 + 70,
            w1 = (230 - w) * .2;

        ctx1.clearRect(0, 0, cw, ch);
        ctx2.clearRect(0, 0, cw, ch);

        ctx1.fillStyle = ctx2.fillStyle = Const.COLORS[clr][1];

        ctx1.beginPath();
        ctx1.moveTo(cw - w - w1, 0);
        ctx1.lineTo(cw - w1, 0);
        ctx1.lineTo(cw - w1, 30);
        ctx1.lineTo(cw, 30);
        ctx1.lineTo(cw, ch);
        ctx1.lineTo(cw - w - w1, ch);
        ctx1.closePath();
        ctx1.fill();

        ctx2.beginPath();
        ctx2.moveTo(w1, 0);
        ctx2.lineTo(w1 + w, 0);
        ctx2.lineTo(w1 + w, ch);
        ctx2.lineTo(0, ch);
        ctx2.lineTo(0, 30);
        ctx2.lineTo(w1, 30);
        ctx2.closePath();
        ctx2.fill();

        const h = Const.HEIGHT - 120;

        this.lftPt.set(-cw, h);
        this.rgtPt.set(Const.WIDTH, h);
        this.left = -(cw - w - w1);
        this.right = Const.WIDTH - w - w1;

        const b = cw - (cw - w - w1) - w1;
        this.boxes[0].set(b - 22, h, b - 2, h + 90);
        this.boxes[1].set(b + 2, h + 30, b + w1, h + 110);

        return 2 * (cw - w - (w1 >> 1));
    }

    update(dt) {
        this.lftPt.x += dt * 600;
        this.rgtPt.x -= dt * 600;
        if (this.lftPt.x > this.left) {
            this.lftPt.x = this.left;
            this.rgtPt.x = this.right;
            return false;
        }
        return true;
    }

    draw(ctx) {
        ctx.drawImage(this.cnvLeft, this.lftPt.x, this.lftPt.y);
        ctx.drawImage(this.cnvRight, this.rgtPt.x, this.rgtPt.y);
    }
}