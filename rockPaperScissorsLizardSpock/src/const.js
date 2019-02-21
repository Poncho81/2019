export const resultText = [
    "DRAW",
    "SCISSORS CUTS PAPER",
    "PAPER COVERS ROCK",
    "ROCK CRUSHES LIZARD",
    "LIZARD POINSONS SPOCK",
    "SPOCK SMASHES SCISSORS",
    "SCISSORS DECAPITATES LIZARD",
    "LIZARD EATS PAPER",
    "PAPER DISPROVES SPOCK",
    "SPOCK VAPORIZES ROCK",
    "ROCK CRUSHES SCISSORS"
];

export const ROCK = 0;
export const SCISSORS = 1;
export const LIZARD = 2;
export const PAPER = 3;
export const SPOCK = 4;
export const W_COUNT = 5;

export const DRAW = 0;
export const PLAYER = 1;
export const COMPUTER = 2;

export const txtIndex = [
    [0, 10, 3, 2, 9],
    [10, 0, 6, 1, 5],
    [3, 6, 0, 7, 4],
    [2, 1, 7, 0, 8],
    [9, 5, 4, 8, 0]
];

export const results = [
    [DRAW, PLAYER, PLAYER, COMPUTER, COMPUTER],
    [COMPUTER, DRAW, PLAYER, PLAYER, COMPUTER],
    [COMPUTER, COMPUTER, DRAW, PLAYER, PLAYER],
    [PLAYER, COMPUTER, COMPUTER, DRAW, PLAYER],
    [PLAYER, PLAYER, COMPUTER, COMPUTER, DRAW]
]