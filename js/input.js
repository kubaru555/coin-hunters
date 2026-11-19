const directions = {
  arrowleft: 'left', a: 'left',
  arrowright: 'right', d: 'right',
  arrowup: 'up', w: 'up',
  arrowdown: 'down', s: 'down',
};
const pressedKeys = new Set();

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (Object.hasOwn(directions, key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    pressedKeys.add(key);
  }
});

window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

window.addEventListener('blur', () => pressedKeys.clear());
