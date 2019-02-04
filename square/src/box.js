export default class Box {
    constructor(l, r) {
        this.l = 0;
        this.r = 0;
        this.t = 0;
        this.b = 0;
    }

    set(l, t, r, b) {
        this.l = l;
        this.r = r;
        this.t = t;
        this.b = b;
    }

    collided(b) {
        return !(((this.b < b.t) || (this.t > b.b) || (this.r < b.l) || (this.l > b.r)));
    }

    get box() {
        return {
            t: this.t,
            l: this.l,
            r: this.r,
            b: this.b
        };
    }
}