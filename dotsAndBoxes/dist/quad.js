import Point from "./point.js";
export default class Quad {
    constructor() {
        this.setted = false;
        this.color = "";
        this.lines = [];
        this.points = [];
    }
    addLines(line) {
        this.points.push(line.line[0], line.line[1]);
        this.lines.push(line.index);
    }
    draw(ctx) {
        if (this.setted) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
        }
    }
    hasLines(l1) {
        return this.lines.findIndex(e => e === l1) > -1;
    }
    setLine(l1, color) {
        const z = this.lines.findIndex(e => e === l1);
        this.lines.splice(z, 1);
        if (this.lines.length > 0)
            return false;
        this.setted = true;
        this.color = color;
        let xg, xs, yg, ys;
        xs = this.points.reduce((xs, p) => p.x < xs ? p.x : xs, this.points[0].x);
        ys = this.points.reduce((ys, p) => p.y < ys ? p.y : ys, this.points[0].y);
        xg = this.points.reduce((xg, p) => p.x > xg ? p.x : xg, this.points[0].x);
        yg = this.points.reduce((yg, p) => p.y > yg ? p.y : yg, this.points[0].y);
        this.points = [];
        this.points.push(new Point(xs, ys));
        this.points.push(new Point(xg - xs, yg - ys));
        return true;
    }
}
