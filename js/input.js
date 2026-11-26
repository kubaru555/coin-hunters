const directions = {
  arrowleft: 'left', a: 'left',
  arrowright: 'right', d: 'right',
  arrowup: 'up', w: 'up',
  arrowdown: 'down', s: 'down',
};
const pressedKeys = new Set();

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if ((Object.hasOwn(directions, key) || key === 'e') && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    pressedKeys.add(key);
  }
});

window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

function releaseControls() {
  pressedKeys.clear();
  pointer.down = false;
}

function pauseGame() {
  releaseControls();
  if (game.stage === 'wave' || game.stage === 'break') game.paused = true;
  updateInterface();
}

window.addEventListener('blur', pauseGame);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});

function updatePointer(event) {
  const rect = board.getBoundingClientRect();
  const border = board.clientLeft;
  pointer.x = (event.clientX - rect.left - border) * board.width / board.clientWidth;
  pointer.y = (event.clientY - rect.top - border) * board.height / board.clientHeight;
  pointer.aiming = true;
}

board.addEventListener('pointermove', updatePointer);
board.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  updatePointer(event);
  pointer.down = true;
});
window.addEventListener('pointerup', () => { pointer.down = false; });
window.addEventListener('pointercancel', () => { pointer.down = false; });
board.addEventListener('pointerleave', () => {
  pointer.down = false;
  pointer.aiming = false;
});
