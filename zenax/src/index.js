import * as Const from "./const.js";
import Game from "./game.js"
import Resources from "./resources.js"
import Point from "./point.js";
import Particles from "./particles.js";
import Sound from "./sound.js";

class Zenax extends Game {
    constructor() {
        super();
        this.board;
        this.down;
        this.time;
        this.gameOver;
        this.score;
        this.sound = new Sound(["../snd/yes.mp3", "../snd/no.mp3"]);
        this.hiscore = 0;

        this.scr = document.getElementById("score");
        this.tm = document.getElementById("time");
        this.btn = document.getElementById("btn");
        this.btn.addEventListener("click", () => {
            this.reset();
        }, false);

        this.ctx.lineWidth = 4;

        this.mouse = new Point();
        this.mousePos = new Point();

        this.res = new Resources(() => {
            this.particles = new Particles(this.res);
            this.reset();
            this.loop();
        });

        this.canvas.addEventListener("mousedown", (e) => {
            this.mousePressed(e, true);
        }, false);

        this.canvas.addEventListener("mouseup", (e) => {
            this.mousePressed(e, false);
        }, false);

        this.canvas.addEventListener("mousemove", (e) => {
            this.mouseMove(e);
        }, false);
    }

    reset() {
        this.btn.style.visibility = "hidden";
        this.board = [];
        for (let c = 0; c < Const.TCNT; c++) {
            this.board.push([]);
            for (let r = 0; r < Const.TCNT; r++) {
                this.board[c].push(Math.floor(Math.random() * 4));
            }
        }

        this.down = this.gameOver = false;
        this.time = 300;
        this.score = 0;
    }

    draw() {
        for (let c = 0; c < Const.TCNT; c++) {
            for (let r = 0; r < Const.TCNT; r++) {
                const d = this.board[c][r];
                this.ctx.drawImage(this.res.images[d], c * 35 + 10, r * 35 + 10);
            }
        }

        if (this.down) {
            const w = this.mousePos.x - this.mouse.x,
                h = this.mousePos.y - this.mouse.y;
            this.ctx.beginPath();
            this.ctx.rect(this.mouse.x, this.mouse.y, w, h);
            this.ctx.stroke();
        }

        this.particles.draw(this.ctx);
    }

    update(dt) {
        if (0 >= (this.time -= dt)) {
            this.gameOver = true;
            this.down = false;
            this.time = 0;
            this.btn.style.visibility = "visible";
        }
        this.particles.update(dt);

        const m = Math.floor(this.time / 60),
            s = Math.floor(this.time - 60 * m);
        this.tm.innerText = `${m}:` + (s < 10 ? "0" : "") + `${s}`;
    }

    check() {
        let x1 = Math.floor((this.mouse.x - 28) / 35),
            y1 = Math.floor((this.mouse.y - 28) / 35),
            x2 = Math.floor((this.mousePos.x - 28) / 35),
            y2 = Math.floor((this.mousePos.y - 28) / 35);

        if (x1 === x2 && y1 === y2) return;

        if (x1 > x2) {
            let a = x2;
            x2 = x1;
            x1 = a;
        }
        if (y1 > y2) {
            let a = y2;
            y2 = y1;
            y1 = a;
        }

        const ca = (x2 - x1 + 1),
            cb = (y2 - y1 + 1);
        if (ca < 2 || cb < 2) return;


        if (this.board[x1][y1] === this.board[x2][y2] &&
            this.board[x1][y1] === this.board[x1][y2] &&
            this.board[x1][y1] === this.board[x2][y1]) {

            this.sound.play(0);

            for (let y = y1; y <= y2; y++) {
                for (let x = x1; x <= x2; x++) {
                    this.board[x][y] = Math.floor(Math.random() * 4);
                    this.particles.start(x * 35 + 28, y * 35 + 28);
                }
            }

            const c = ca * cb;
            this.score += c * 5 + c;
            if (this.score > this.hiscore) {
                this.hiscore = this.score;
            }
            this.scr.innerText = `${this.score}`;
        } else {
            this.sound.play(1);
        }
    }

    mousePressed(e, down) {
        if (this.gameOver) return;

        if (down) {
            const x = Math.floor((e.offsetX / Const.SCALE - 10) / 35),
                y = Math.floor((e.offsetY / Const.SCALE - 10) / 35);
            if (x > (Const.TCNT - 1) || y > (Const.TCNT - 1) || x < 0 || y < 0) return;
            this.down = true;
            this.mouse.set(x * 35 + 28, y * 35 + 28);
            this.mousePos.set(this.mouse.x, this.mouse.y);
        } else {
            this.down = false;
            this.check();
            this.mouse.set(-1, -1);
            this.mousePos.set(this.mouse.x, this.mouse.y);
        }
    }
    mouseMove(e) {
        if (this.down) {
            const x = Math.floor((e.offsetX / Const.SCALE - 10) / 35),
                y = Math.floor((e.offsetY / Const.SCALE - 10) / 35);
            if (x > (Const.TCNT - 1) || y > (Const.TCNT - 1) || x < 0 || y < 0) return;
            this.mousePos.set(x * 35 + 28, y * 35 + 28);
        }
    }
}

new Zenax();