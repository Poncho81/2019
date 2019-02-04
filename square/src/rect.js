import * as Const from "./const.js"
import Point from "./point.js";
import Box from "./box.js";

export default class Rect {
    constructor(cb) {
        this.state;
        this.fallSpeed;
        this.ang;
        this.squareAng;
        this.squareSz;
        this.squarePos = new Point();
        this.box = new Box();
        this.colorIdx;
        this.reset();
    }

    reset(clr = 0) {
        this.colorIdx = clr;
        this.state = Const.WAIT;
        this.fallSpeed = 0;
        this.ang = 0;
        this.squareAng = 0;
        this.squareSz = 40;
        this.squarePos.set((Const.WIDTH >> 1), (Const.HEIGHT >> 1) - 240);
    }

    update(dt) {
        switch (this.state) {
            case Const.WAIT:
                if ((this.ang += dt * 4) > Const.TWO_PI) this.ang = 0;
                this.squareAng = Math.cos(this.ang) * .25
                break;
            case Const.GROW:
                if ((this.ang += dt * 4) > Const.TWO_PI) this.ang = 0;
                this.squareAng = Math.cos(this.ang) * .25
                this.squareSz += dt * 120;
                if (this.squareSz > 400) {
                    this.squareSz = 400;
                }
                break;
            case Const.FALL:
                this.squarePos.y += dt * this.fallSpeed;
                const s = this.squareSz >> 1,
                    x = this.squarePos.x - s,
                    y = this.squarePos.y - s;
                this.box.set(x, y, x + this.squareSz, y + this.squareSz);
                this.fallSpeed += dt * 1400;
                break;
            case Const.GOUP:
                if ((this.ang += dt * 4) > Const.TWO_PI) this.ang = 0;
                this.squareAng = Math.cos(this.ang) * .25;
                this.squarePos.y -= dt * this.fallSpeed;
                const z = (Const.HEIGHT >> 1) - 240,
                    dif = this.squarePos.y - z,
                    pc = dif * 100 / this.dist,
                    sd = this.size * pc / 100;
                this.squareSz = sd < 40 ? 40 : sd;

                if (this.squarePos.y < z) {
                    this.squarePos.y = z;
                    this.fallSpeed = 0;
                    this.state = Const.WAIT;
                    return true;
                }

                this.fallSpeed += dt * 1400;
                break;
            case Const.SCORE:
                break;
            case Const.DEAD:
                break;
        }
        return false;
    }

    stop(state, box) {
        this.state = state;
        this.squarePos.y = box.t - (this.squareSz >> 1);
        this.dist = this.squarePos.y - ((Const.HEIGHT >> 1) - 240);
        this.full = this.squareSz;
        this.size = this.squareSz - 40;
    }

    draw(ctx) {
        const s = (this.squareSz >> 1);
        ctx.save();
        ctx.fillStyle = Const.COLORS[this.colorIdx][1];
        ctx.translate(this.squarePos.x, this.squarePos.y);
        ctx.rotate(this.squareAng);
        ctx.fillRect(-s, -s, this.squareSz, this.squareSz)
        ctx.restore();
    }
}