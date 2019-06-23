import * as Const from "./const.js";
import Entity from "./entity.js";

class Fruit extends Entity {
    constructor() {
        super(1);
        this.anim = [0];
        this.type;
    }

    update(dt) {
        if ((this.pos.x += this.speed * dt) < -this.getBmp().wid) {
            this.alive = false;
            return;
        }
        this.pos.y += Math.cos(this.angle) * 15 * dt;
        if ((this.angle += dt * .5) > Const.TWO_PI) this.angle = 0;
    }

    draw(ctx) {
        const img = this.getBmp();
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(Math.sin(this.angle));
        ctx.drawImage(img.img, -img.wid >> 1, -img.hei >> 1);
        ctx.restore();
    }
}


export default class Bonus {
    constructor(mor, cer) {
        this.img = [mor, cer];
        this.fruits = [];
        this.waitTime = Math.random() * 20 + 6;
        for (let r = 0; r < 20; r++) {
            this.fruits.push(new Fruit());
        }
    }

    getFrut() {
        for (let b of this.fruits) {
            if (!b.alive) return b;
        }
        return null;
    }

    initBonus() {
        const b = this.getFrut();
        if (!b) return;
        b.alive = true;
        b.angle = Math.random() * Const.TWO_PI;
        b.speed = -(Math.random() * 60 + 90);
        b.type = Math.random() > .15 ? 1 : 0;
        const img = this.img[b.type];
        b.addImage(img);
        b.pos.set(Const.WIDTH + img.width, Math.random() * (Const.HEIGHT - 40) + 20);
    }

    update(dt) {
        for (let b of this.fruits) {
            if (b.alive) b.update(dt);
        }

        if ((this.waitTime -= dt) < 0) {
            this.waitTime = Math.random() * 10 + 6;
            this.initBonus();
        }
    }

    draw(ctx) {
        for (let b of this.fruits) {
            if (b.alive)
                b.draw(ctx);
        }
    }

    reset() {
        for (let b of this.fruits) {
            b.alive = false;
        }
    }
}