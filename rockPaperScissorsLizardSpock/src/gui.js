import * as Const from "./const.js";

export default class Gui {
    constructor(click) {
        this.playerScore = 0;
        this.computerScore = 0;
        this.playScore = document.getElementById("pscore");
        this.compScore = document.getElementById("cscore");

        this.playW = document.getElementById("wplayer");
        this.compW = document.getElementById("wcomputer");
        this.txtRes = document.getElementById("txtres");

        document.getElementById("r").addEventListener("click", click, false);
        document.getElementById("p").addEventListener("click", click, false);
        document.getElementById("s").addEventListener("click", click, false);
        document.getElementById("l").addEventListener("click", click, false);
        document.getElementById("o").addEventListener("click", click, false);

        this.first = true;
    }

    getImg(i) {
        switch (i) {
            case Const.ROCK:
                return "rock";
            case Const.PAPER:
                return "paper";
            case Const.SCISSORS:
                return "scissors";
            case Const.LIZARD:
                return "lizard";
            case Const.SPOCK:
                return "spock";
        }
        return "";
    }

    setImages(p, c, r) {
        if (this.first) {
            this.first = false;
            document.getElementById("result").style.display = "block";
        }
        const pw = this.getImg(p),
            cw = this.getImg(c);
        this.playW.src = `./img/${pw}b.png`;
        this.compW.src = `./img/${cw}l.png`;
        const t = Const.txtIndex[p][c];
        this.txtRes.innerText = Const.resultText[t];

        switch (r) {
            case Const.DRAW:
                this.txtRes.style.backgroundColor = "#440";
                break;
            case Const.PLAYER:
                this.txtRes.style.backgroundColor = "#030";
                break;
            case Const.COMPUTER:
                this.txtRes.style.backgroundColor = "#300";
                break;
        }
    }

    addScore(p) {
        if (!p) return;
        if (p === Const.PLAYER) {
            this.playerScore++;
            this.playScore.innerText = `${this.playerScore}`;
        } else {
            this.computerScore++;
            this.compScore.innerText = `${this.computerScore}`;
        }
    }
}