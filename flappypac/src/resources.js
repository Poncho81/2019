import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(20);

        Promise.all([
            (this.loadImage("./img/pac1.gif")).then((i) => {
                this.images[Const.PAC1] = i;
            }),
            (this.loadImage("./img/pac2.gif")).then((i) => {
                this.images[Const.PAC2] = i;
            }),
            (this.loadImage("./img/pac3.gif")).then((i) => {
                this.images[Const.PAC3] = i;
            }),
            (this.loadImage("./img/blu1.gif")).then((i) => {
                this.images[Const.BLU1] = i;
            }),
            (this.loadImage("./img/blu2.gif")).then((i) => {
                this.images[Const.BLU2] = i;
            }),
            (this.loadImage("./img/org1.gif")).then((i) => {
                this.images[Const.ORG1] = i;
            }),
            (this.loadImage("./img/org2.gif")).then((i) => {
                this.images[Const.ORG2] = i;
            }),
            (this.loadImage("./img/red1.gif")).then((i) => {
                this.images[Const.RED1] = i;
            }),
            (this.loadImage("./img/red2.gif")).then((i) => {
                this.images[Const.RED2] = i;
            }),
            (this.loadImage("./img/pin1.gif")).then((i) => {
                this.images[Const.PIN1] = i;
            }),
            (this.loadImage("./img/pin2.gif")).then((i) => {
                this.images[Const.PIN2] = i;
            }),
            (this.loadImage("./img/bmb1.gif")).then((i) => {
                this.images[Const.BMB1] = i;
            }),
            (this.loadImage("./img/bmb2.gif")).then((i) => {
                this.images[Const.BMB2] = i;
            }),
            (this.loadImage("./img/frt1.gif")).then((i) => {
                this.images[Const.FRU1] = i;
            }),
            (this.loadImage("./img/frt2.gif")).then((i) => {
                this.images[Const.FRU2] = i;
            }),
            (this.loadImage("./img/back.jpg")).then((i) => {
                this.images[Const.BACK] = i;
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