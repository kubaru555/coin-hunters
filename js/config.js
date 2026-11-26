const board = document.querySelector('#board');
const context = board.getContext('2d');

const worldWidth = 1280;
const worldHeight = 768;
const playerSpeed = 180; // Piksele na sekundę. Zmień tę liczbę i odśwież grę.
const playerSize = 28;
const player = { x: 146, y: 370, size: playerSize, angle: Math.PI / 2 };

const weapons = [
  { name: 'Miotacz groszku', price: 0, damage: 1, color: '#9fe36a' },
  { name: 'Wyrzutnia kości', price: 6, damage: 2, color: '#fff1ce' },
  { name: 'Wyrzutnia złotych kości', price: 14, damage: 3, color: '#ffd16d' },
];
const waveSettings = [
  { count: 6, health: 3, speed: 45 },
  { count: 8, health: 4, speed: 50 },
  { count: 10, health: 5, speed: 55 },
  { count: 12, health: 6, speed: 60 },
  { count: 14, health: 7, speed: 65 },
];
const game = {
  stage: 'ready', paused: false, wave: 0, health: 5, coins: 0,
  weapon: 0, owned: new Set([0]), invulnerable: 0, shotCooldown: 0,
  pickupCooldown: 0, elapsed: 0,
};
const zombies = [];
const bullets = [];
const coins = [];
const floatingTexts = [];
const pointer = { x: board.width / 2, y: board.height / 2, down: false, aiming: false };

function playerCenter() {
  return { x: player.x + playerSize / 2, y: player.y + playerSize / 2 };
}

function isInsideCabin(x, y) {
  return x > cabin.x + cabin.wall && x < cabin.x + cabin.w - cabin.wall
    && y > cabin.y + cabin.wall && y < cabin.y + cabin.h;
}
