import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(10);

        Promise.all([
            (this.loadImage("./img/01.png")).then((i) => {
                this.images[Const.A] = i;
            }),
            (this.loadImage("./img/02.png")).then((i) => {
                this.images[Const.B] = i;
            }),
            (this.loadImage("./img/03.png")).then((i) => {
                this.images[Const.C] = i;
            }),
            (this.loadImage("./img/04.png")).then((i) => {
                this.images[Const.D] = i;
            }),
            (this.loadImage("./img/05.png")).then((i) => {
                this.images[Const.E] = i;
            }),
            (this.loadImage("./img/06.png")).then((i) => {
                this.images[Const.F] = i;
            }),
            (this.loadImage("./img/st1.png")).then((i) => {
                this.images[Const.S] = i;
            }),
            (this.loadImage("./img/st2.png")).then((i) => {
                this.images[Const.T] = i;
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