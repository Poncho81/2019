import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(4);

        Promise.all([
            (this.loadImage("./img/open.png")).then((i) => {
                this.images[Const.OPN] = i;
            }),
            (this.loadImage("./img/closed.png")).then((i) => {
                this.images[Const.CLD] = i;
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