import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(10);

        Promise.all([
            (this.loadImage("./img/back.jpg")).then((i) => {
                this.images[Const.BK] = i;
            }),
            (this.loadImage("./img/hero.gif")).then((i) => {
                this.images[Const.HR] = i;
            }),
            (this.loadImage("./img/wlk1.gif")).then((i) => {
                this.images[Const.W1] = i;
            }),
            (this.loadImage("./img/wlk2.gif")).then((i) => {
                this.images[Const.W2] = i;
            }),
            (this.loadImage("./img/wlk3.gif")).then((i) => {
                this.images[Const.W3] = i;
            }),
            (this.loadImage("./img/grass.png")).then((i) => {
                this.images[Const.GR] = i;
            }),
            (this.loadImage("./img/badl.png")).then((i) => {
                this.images[Const.BL] = i;
            }),
            (this.loadImage("./img/badr.png")).then((i) => {
                this.images[Const.BR] = i;
            }),
            (this.loadImage("./img/boom.png")).then((i) => {
                this.images[Const.BM] = i;
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