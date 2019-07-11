import Player from "./player.js";

export default class Gui {
    score2: HTMLElement;
    score1: HTMLElement;
    turn: HTMLElement;

    constructor() {
        this.turn = document.getElementById("turn");
        this.score1 = document.getElementById("score1");
        this.score2 = document.getElementById("score2");
    }

    set(a: number, b: number, turn: number, players: Player[]) {
        this.turn.style.color = players[turn].color;
        this.turn.innerHTML = `${players[turn].name} plays`;
        this.score1.style.color = players[0].color;
        this.score1.innerHTML = `${players[0].name} : ${a}`;
        this.score2.style.color = players[1].color;
        this.score2.innerHTML = `${players[1].name} : ${b}`;
    }
}