import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(30);

        Promise.all([
            (this.loadImage("./img/00.png")).then((i) => {
                this.images[Const.A] = i;
            }),
            (this.loadImage("./img/01.png")).then((i) => {
                this.images[Const.B] = i;
            }),
            (this.loadImage("./img/02.png")).then((i) => {
                this.images[Const.C] = i;
            }),
            (this.loadImage("./img/le.png")).then((i) => {
                this.images[Const.L] = i;
            }),
            (this.loadImage("./img/ri.png")).then((i) => {
                this.images[Const.R] = i;
            })
        ]).then(() => {
            cb();
        });
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }
}