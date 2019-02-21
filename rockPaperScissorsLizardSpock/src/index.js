import * as Const from "./const.js";
import Gui from "./gui.js";

class Stats {
    constructor() {
        this.moves = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        this.results = [0, 0, 0];
    }

    getMoveCount(p, m) {
        return this.moves[p][m];
    }

    getResults(r) {
        return this.results[r];
    }

    addResults(r) {
        this.results[r]++;
    }

    addMove(p, m) {
        this.moves[p][m]++;
    }
}

class rpsls {
    constructor() {
        this.stats = new Stats();
        this.gui = new Gui((e) => {
            let pm;
            switch (e.srcElement.id) {
                case 'r':
                    pm = Const.ROCK;
                    break;
                case 'p':
                    pm = Const.PAPER;
                    break;
                case 's':
                    pm = Const.SCISSORS;
                    break;
                case 'l':
                    pm = Const.LIZARD;
                    break;
                case 'o':
                    pm = Const.SPOCK;
                    break;
            }

            this.stats.addMove(Const.PLAYER, pm);

            let cm = this.getComputerMove();
            this.stats.addMove(Const.COMPUTER, cm);

            const r = Const.results[pm][cm];
            this.stats.addResults(r);

            this.gui.setImages(pm, cm, r);
            this.gui.addScore(r);
        });
    }

    getComputerMove() {
        let total = 0,
            r, s;
        for (let i = Const.ROCK; i < Const.W_COUNT; total += this.stats.getMoveCount(Const.PLAYER, i++));
        r = Math.floor(Math.random() * total);

        for (let i = Const.SPOCK; i > Const.SCISSORS; i--) {
            s = this.stats.getMoveCount(Const.PLAYER, i);
            if (r < s) return (i - 1);
            r -= s;
        }
        return Const.SPOCK;
    }
}

new rpsls();