import * as Const from "./const.js"

class Spike {
    constructor(left, y) {
        this.left;
        this.x;
        this.y;
        this.set(left, y);
    }

    set(left, y) {
        this.left = left;
        this.x = left ? (Const.WIDTH >> 1) - 50 : (Const.WIDTH >> 1) + 20;
        this.y = y;
    }

    get box() {
        return {
            t: this.y + 4,
            l: this.x,
            r: this.x + 30,
            b: this.y + 27
        };
    }
}


export default class Spikes {
    constructor(l, r) {
        this.imgL = l;
        this.imgR = r;
        this.dist = 50;
        this.spikes = [];
        this.run = 1;

        let side = Math.random() < .5,
            y = -31;

        for (let i = 0; i < 20; i++) {
            const s = new Spike(side, y);
            y -= 40;
            if (Math.random() > .5 || this.run > 4) {
                y -= this.dist;
                this.run = 1;
                side = !side;
            } else {
                this.run++;
            }
            this.spikes.push(s);
        }
    }

    update(spd) {
        for (let s of this.spikes) {
            s.y += spd;
            if (s.y > Const.HEIGHT) {
                this.spikes.sort((a, b) => {
                    return b.y - a.y
                });

                const sp = this.spikes[this.spikes.length - 1];
                let side = sp.left,
                    y = sp.y - 40;

                if (Math.random() > .5 || this.run > 4) {
                    y -= this.dist;
                    this.run = 1;
                    side = !side;
                } else {
                    this.run++;
                }
                s.set(side, y);
            }
        }
    }

    reset() {
        this.dist = 50;
        this.run = 1;
        let side = Math.random() < .5,
            y = -31;

        for (let i = 0; i < 20; i++) {
            const s = this.spikes[i];
            s.set(side, y);

            y -= 40;
            if (Math.random() > .5 || this.run > 4) {
                y -= 50;
                this.run = 1;
                side = !side;
            } else {
                this.run++;
            }
        }
    }

    draw(ctx) {
        for (let s of this.spikes) {
            if (s.y < -31) continue;
            ctx.drawImage(s.left ? this.imgL : this.imgR, s.x, s.y);

            /*
                        const bx = s.box;
                        ctx.strokeStyle = "red";
                        ctx.beginPath();
                        ctx.moveTo(bx.l, bx.t);
                        ctx.lineTo(bx.r, bx.t);
                        ctx.lineTo(bx.r, bx.b);
                        ctx.lineTo(bx.l, bx.b);
                        ctx.closePath()
                        ctx.stroke();
                        */
        }
    }
}