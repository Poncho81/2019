import * as Const from "./const.js";
import Game from "./game.js"
import Resources from "./resources.js"
import Rect from "./rect.js";

class Tile {
    constructor(clr, x, y) {
        this.x = x;
        this.y = y;
        this.clr = clr;
        this.alive = true;
    }
}

class Blix extends Game {
    constructor() {
        super();
        this.hiscore = 0;
        this.rects = [
            new Rect(16, 38, 21, 21),
            new Rect(16, 73, 21, 21),
            new Rect(16, 108, 21, 21),
            new Rect(494, 38, 21, 21),
            new Rect(494, 73, 21, 21),
            new Rect(494, 108, 21, 21)
        ];

        this.mvsDiv = document.getElementById("moves");
        this.scrDiv = document.getElementById("score");
        this.hscDiv = document.getElementById("hiscore");
        this.scoring;
        this.scoreCols;
        this.score;
        this.moves;
        this.cols;
        this.board;
        this.gameOver;

        this.res = new Resources(() => {
            this.reset();
            this.loop();
        });

        this.canvas.addEventListener("click", (e) => {
            if (this.click(e)) {
                this.scoreCols = this.checkColumns();
                this.moves -= 2;

                if (this.scoreCols.length > 0) {
                    this.scoring = true;
                } else {
                    if (this.moves < 1) {
                        this.gameOver = true;
                        this.moves = 0;
                    }
                }
                this.updateScore();
            }
        }, false);
    }

    updateScore() {
        this.mvsDiv.innerText = this.moves < 1 ? "0" : `${this.moves}`;
        this.scrDiv.innerText = `${this.score}`;
        this.hscDiv.innerText = `${this.hiscore}`;
    }

    reset() {
        this.gameOver = this.scoring = false;
        this.score = 0;
        this.moves = 6;
        this.cols = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

        this.updateScore();

        while (true) {
            this.board = [
                [],
                [],
                []
            ];

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 12; c++) {
                    const t = new Tile(Math.floor(Math.random() * 3), 50 + 34 * c + 2 * c, 30 + 34 * r + 2 * r);
                    this.board[r].push(t);
                }
            }
            const z = this.checkColumns();
            if (z.length < 1) return;
        }
    }

    click(e) {
        if (this.scoring) return;

        for (let r = 0; r < 6; r++) {
            const rc = this.rects[r],
                x = e.offsetX / Const.SCALE,
                y = e.offsetY / Const.SCALE;

            if (rc.contains(x, y)) {
                let t;
                if (r < 3) {
                    t = this.board[r][11].clr;
                    for (let w = 10; w > -1; w--) {
                        this.board[r][w + 1].clr = this.board[r][w].clr;
                    }
                    this.board[r][0].clr = t;
                    return true;
                } else {
                    r -= 3;
                    t = this.board[r][0].clr;
                    for (let w = 1; w < 12; w++) {
                        this.board[r][w - 1].clr = this.board[r][w].clr;
                    }
                    this.board[r][11].clr = t;
                    return true;
                }
            }
        }
        return false;
    }

    checkColumns() {
        const r = [];
        for (let c = 0; c < 12; c++) {
            if (this.board[0][c].clr === this.board[1][c].clr && this.board[1][c].clr === this.board[2][c].clr) {
                r.push(c);
            }
        }
        return r;
    }

    draw() {
        for (let r = 0; r < 3; r++) {
            const l = 37 + 34 * r + r;
            this.ctx.drawImage(this.res.images[Const.R], 16, l);
            this.ctx.drawImage(this.res.images[Const.L], 494, l);
        }

        for (let c = 0; c < 12; c++) {
            this.ctx.globalAlpha = this.cols[c];
            for (let r = 0; r < 3; r++) {
                const t = this.board[r][c];
                const n = this.res.images[t.clr];
                this.ctx.drawImage(n, t.x, t.y);
            }
        }
        this.ctx.globalAlpha = 1;
    }

    update(dt) {
        if (this.gameOver) {
            let f = false;
            for (let c = 0; c < 12; c++) {
                for (let r = 0; r < 3; r++) {
                    const t = this.board[r][c];
                    if (t.alive) {
                        const s = Math.random() * 40 + 50;
                        t.y += dt * s * ((c & 1 === 1) ? 1 : -1) * (s >> 4 * (Math.random() < .5 ? 1 : -1));
                        t.x += dt * s * ((r & 1 === 1) ? 1 : -1) * (s >> 4 * (Math.random() < .5 ? 1 : -1));
                        if (t.x < -34 || t.x > Const.WIDTH + 34 || t.y < -34 || t.y > Const.HEIGHT + 34) {
                            t.alive = false;
                        } else {
                            f = true;
                        }
                    }
                }
            }
            if (!f) {
                this.reset();
            }
        }
        if (!this.scoring) return;
        let zero = false;
        for (let t = this.scoreCols.length - 1; t > -1; t--) {
            const c = this.scoreCols[t];
            if ((this.cols[c] -= 2 * dt) < 0) {
                zero = true;
                this.cols[c] = 1;
                this.board[0][c].clr = -1;
                this.board[1][c].clr = -1;
                this.board[2][c].clr = -1;
            }
        }

        if (!zero) return;

        for (let c = 11; c > -1; c--) {
            let cc = c;
            if (this.board[0][c].clr < 0) {
                while (true) {
                    if (--cc < 0) {
                        this.fill();
                        return;
                    }
                    if (this.board[0][cc].clr > -1) {
                        this.board[0][c].clr = this.board[0][cc].clr;
                        this.board[0][cc].clr = -1;
                        this.board[1][c].clr = this.board[1][cc].clr;
                        this.board[1][cc].clr = -1;
                        this.board[2][c].clr = this.board[2][cc].clr;
                        this.board[2][cc].clr = -1;
                        break;
                    }
                }
            }
        }

    }

    checkRows() {
        for (let r = 0; r < 3; r++) {
            const b = [0, 1, 2];
            for (let c = 0; c < 12; c++) {
                const id = b.indexOf(this.board[r][c].clr);
                if (id > -1) {
                    b.splice(id, 1);
                    if (b.length < 1) break;
                }
            }
            if (b.length > 0) return true;
        }
        return false;
    }

    fill() {
        let tt;
        do {
            for (let t = 0; t < this.scoreCols.length; t++) {
                const b = [0, 1, 2];
                for (let r = 0; r < 3; r++) {
                    let bb = Math.floor(Math.random() * b.length);
                    this.board[r][t].clr = b[bb];
                    b.splice(bb, 1);
                }
            }
            tt = this.checkRows();
        } while (this.checkColumns().length > 0 || tt);
        this.scoring = false;
        this.score += this.scoreCols.length * 100;
        this.moves += this.scoreCols.length;
        if (this.score > this.hiscore) {
            this.hiscore = this.score;
        }

        if (this.moves < 1) {
            this.gameOver = true;
            this.moves = 0;
        }

        this.updateScore();
    }
}

new Blix();