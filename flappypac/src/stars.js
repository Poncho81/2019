import * as Const from "./const.js";
import Point from "./point.js";

class Star {
    constructor(plane) {
        this.pos = new Point(Math.random() * Const.WIDTH, Math.random() * Const.HEIGHT);
        this.alpha = 1 / plane;
        this.size = 3 - plane + 1;
        this.speed = (1 / plane) * 24;
    }
}

export default class Stars {
    constructor() {
        this.stars = [];
        this.fill();
    }

    update(dt) {
        for (let s of this.stars) {
            if ((s.pos.x -= s.speed * dt) < -s.size) {
                s.pos.set(Const.WIDTH + s.size, Math.random() * Const.HEIGHT)
            }
        }
    }

    draw(ctx) {
        for (let s of this.stars) {
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            ctx.fillRect(s.pos.x, s.pos.y, s.size, s.size);
        }
    }

    fill() {
        for (let r = 0; r < 10; r++) {
            this.stars.push(new Star(1));
        }
        for (let r = 0; r < 70; r++) {
            this.stars.push(new Star(2));
            this.stars.push(new Star(3));
        }
    }
}