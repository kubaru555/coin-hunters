const board = document.querySelector('#board');
const context = board.getContext('2d');

const worldWidth = 1280;
const worldHeight = 768;
const playerSpeed = 180; // Piksele na sekundę. Zmień tę liczbę i odśwież grę.
const playerSize = 28;
const player = { x: 146, y: 370 };
