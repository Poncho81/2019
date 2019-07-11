import * as Const from "./const.js";
import Point from "./point.js";
export default class Line {
    constructor(pt1, pt2, idx) {
        this.index = idx;
        this.selected = false;
        this.highlighted = false;
        this.line = [pt1, pt2];
        this.highlight = (h) => this.highlighted = h;
        this.select = () => this.selected = true;
        if (pt1.y === pt2.y) {
            this.back = [new Point(pt1.x, pt1.y - Const.DOT), new Point(Math.abs(pt2.x - pt1.x), Const.DOT << 1)];
        }
        else {
            this.back = [new Point(pt1.x - Const.DOT, pt1.y), new Point(Const.DOT << 1, Math.abs(pt2.y - pt1.y))];
        }
    }
    draw(ctx) {
        if (this.selected) {
            ctx.fillStyle = "rgba(51,51,51,1)";
            ctx.fillRect(this.back[0].x, this.back[0].y, this.back[1].x, this.back[1].y);
            ctx.strokeStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo(this.line[0].x, this.line[0].y);
            ctx.lineTo(this.line[1].x, this.line[1].y);
            ctx.stroke();
        }
        else if (this.highlighted) {
            ctx.fillStyle = "rgba(100,100,100,1)";
            ctx.fillRect(this.back[0].x, this.back[0].y, this.back[1].x, this.back[1].y);
        }
        else {
            ctx.fillStyle = "rgba(68,68,68,.75)";
            ctx.fillRect(this.back[0].x, this.back[0].y, this.back[1].x, this.back[1].y);
        }
    }
    hasPoint(pt) {
        return this.back[0].x <= pt.x && pt.x <= this.back[0].x + this.back[1].x &&
            this.back[0].y <= pt.y && pt.y <= this.back[0].y + this.back[1].y;
    }
}
