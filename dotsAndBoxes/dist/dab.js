import * as Const from "./const.js";
import Game from "./game.js";
import Dot from "./dot.js";
import Line from "./line.js";
import Point from "./point.js";
import Quad from "./quad.js";
import Player from "./player.js";
import Gui from "./gui.js";
class DAB extends Game {
    constructor(cnt = 5) {
        super();
        this.gui = new Gui();
        this.player = [new Player("Paulo", "#16d"), new Player("Kati", "#d61")];
        this.gameTurn = 0;
        this.gameover = false;
        this.count = cnt;
        this.canvas.width = this.canvas.height = (cnt - 1) * Const.SEP + 2 * Const.BRD;
        this.dots = [];
        this.lines = [];
        this.quads = [];
        this.canvas.addEventListener("click", (ev) => this.click(null, ev));
        this.canvas.addEventListener("mousemove", (ev) => this.move(ev));
        this.canvas.addEventListener("touchstart", (ev) => this.click(ev, null));
        this.countQuads = (p) => { return this.quads.filter(q => q.color === this.player[p].color).length; };
        this.getLineIndex = (pt) => { return this.lines.findIndex(e => e.hasPoint(pt) && !e.selected); };
        this.getLine = (idx) => { return this.lines.find(e => e.index === idx); };
        this.getAllQuads = (idx) => { return this.quads.filter(e => e.hasLines(idx) && !e.setted); };
        this.draw = () => {
            this.quads.forEach(e => e.draw(this.ctx));
            this.lines.forEach(e => e.draw(this.ctx));
            this.dots.forEach(e => e.draw(this.ctx));
        };
        this.update = (dt) => { };
        this.gui.set(0, 0, this.gameTurn, this.player);
        this.createBoard();
        this.loop(0);
    }
    createBoard() {
        let idx = 0;
        for (let r = 0; r < this.count; r++) {
            for (let c = 0; c < this.count; c++) {
                this.dots.push(new Dot(new Point(c * Const.SEP + Const.BRD, r * Const.SEP + Const.BRD)));
                if (c > 0) {
                    this.lines.push(new Line(this.dots[c + r * this.count - 1].pos, this.dots[c + r * this.count].pos, idx++));
                }
                if (r > 0) {
                    this.lines.push(new Line(this.dots[c + (r - 1) * this.count].pos, this.dots[c + r * this.count].pos, idx++));
                }
            }
        }
        let innerS = 0, step = 0, aux = 0, line_cnt = this.count - 1;
        for (let y = 0; y < line_cnt; y++) {
            for (let z = 0; z < line_cnt; z++) {
                const q = new Quad();
                innerS = line_cnt + (y > 0 ? line_cnt : 0);
                aux = (y < 1 ? z : 0);
                q.addLines(this.getLine(step));
                q.addLines(this.getLine(step + innerS + aux));
                q.addLines(this.getLine(step + innerS + aux + 1));
                q.addLines(this.getLine(step + innerS + aux + 2));
                this.quads.push(q);
                step += y > 0 ? 2 : 1;
            }
            step += 1;
        }
    }
    move(ev) {
        this.lines.forEach(e => e.highlight(false));
        const li = this.getLineIndex(new Point(ev.clientX - ev.srcElement.offsetLeft, ev.clientY - ev.srcElement.offsetTop));
        li > -1 && this.lines[li].highlight(true);
    }
    gameOver(p) {
        this.gameover = true;
        const d = document.getElementById("msg");
        d.innerHTML = `${this.player[p].name} is the winner!`;
        d.style.color = this.player[p].color;
        d.style.visibility = "visible";
    }
    click(tev, mev) {
        if (this.gameover)
            return;
        const pt = new Point();
        if (tev) {
            pt.set(tev.touches[0].clientX - tev.srcElement.offsetLeft, tev.touches[0].clientY - tev.srcElement.offsetTop);
            tev.preventDefault();
        }
        else {
            pt.set(mev.clientX - mev.srcElement.offsetLeft, mev.clientY - mev.srcElement.offsetTop);
            mev.preventDefault();
        }
        const li = this.getLineIndex(pt);
        if (li > -1) {
            this.lines[li].select();
            let next = true;
            for (const q of this.getAllQuads(this.lines[li].index)) {
                if (q.setLine(this.lines[li].index, this.player[this.gameTurn].color)) {
                    next = false;
                }
            }
            next && (this.gameTurn = !this.gameTurn ? 1 : 0);
            const a = this.countQuads(0), b = this.countQuads(1);
            this.gui.set(a, b, this.gameTurn, this.player);
            if (a + b >= (this.count - 1) * (this.count - 1)) {
                this.gameOver(a > b ? 0 : 1);
            }
        }
    }
}
new DAB(8);
