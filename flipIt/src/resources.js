import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(5);

        Promise.all([
            (this.loadImage("./img/wall.png")).then((i) => {
                this.images[Const.WL] = i;
            }),
            (this.loadImage("./img/hroL.gif")).then((i) => {
                this.images[Const.HL] = i;
            }),
            (this.loadImage("./img/hroR.gif")).then((i) => {
                this.images[Const.HR] = i;
            }),
            (this.loadImage("./img/spkL.gif")).then((i) => {
                this.images[Const.SL] = i;
            }),
            (this.loadImage("./img/spkR.gif")).then((i) => {
                this.images[Const.SR] = i;
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