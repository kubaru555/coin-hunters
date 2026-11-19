function drawTree(art, x, y, radius) {
  drawOval(art, x + 8, y + 1, radius, radius * 0.62, '#254833');
  drawOval(art, x, y + 8, 13, 6, '#4c3c2d');
  drawOval(art, x, y - 1, 9, 12, '#654633');
  drawOval(art, x - 3, y + 3, 3, 6, '#a07449');
  drawOval(art, x, y - radius * 0.57, radius, radius * 0.66, '#21513c');
  drawOval(art, x - radius * 0.34, y - radius * 0.66, radius * 0.62, radius * 0.53, '#34734b');
  drawOval(art, x + radius * 0.36, y - radius * 0.78, radius * 0.58, radius * 0.48, '#316b47');
  drawOval(art, x - 4, y - radius * 0.92, radius * 0.58, radius * 0.46, '#3d8050');
  drawOval(art, x - 11, y - radius, radius * 0.27, radius * 0.14, '#589456');
}

function drawThicket(art, { x, y, w, h }) {
  art.fillStyle = '#204a35';
  art.fillRect(x, y, w, h);
  const horizontal = w > h;
  const length = horizontal ? w : h;
  const count = Math.ceil(length / 20);
  for (let i = 0; i < count; i++) {
    const distance = (i + 0.5) * length / count;
    const bushX = x + (horizontal ? distance : w / 2);
    const bushY = y + (horizontal ? h / 2 : distance);
    drawOval(art, bushX, bushY, horizontal ? 16 : w / 2 + 2, horizontal ? h / 2 + 2 : 16, '#2a6040');
    drawOval(art, bushX - 3, bushY - 4, 12, 10, i % 2 ? '#3a7546' : '#4a824a');
    drawOval(art, bushX - 6, bushY - 7, 5, 2, '#609253');
  }
}

function drawRock(art, { x, y, w, h }) {
  art.save();
  art.translate(x, y);
  art.scale(w / 28, h / 20);
  drawOval(art, 15, 17, 16, 6, '#284638');
  drawShape(art, 'M0 15 L4 5 L14 0 L24 4 L28 13 L24 19 L7 20 Z', '#6e8078');
  drawShape(art, 'M2 14 L6 6 L14 2 L22 5 L17 11 L7 14 Z', '#a4ad92', false);
  drawShape(art, 'M7 16 L17 12 L25 13 L22 17 L10 19 Z', '#526c61', false);
  art.restore();
}

function drawVine(art, x, y, length) {
  art.save();
  art.translate(x, y);
  art.lineWidth = 3;
  art.strokeStyle = '#243d28';
  art.beginPath();
  art.moveTo(0, 0);
  art.bezierCurveTo(-22, length * 0.26, 22, length * 0.56, -2, length);
  art.stroke();
  for (let i = 1; i < 6; i++) {
    const side = i % 2 ? 1 : -1;
    const offset = [-4, -3, 0, 3, 2][i - 1];
    art.save();
    art.translate(offset, i * length / 6);
    art.rotate(side * -0.65);
    drawOval(art, side * 5, 0, 8, 3.5, i % 2 ? '#8bb457' : '#638f46');
    art.restore();
  }
  art.restore();
}

function drawFossil(art, x, y) {
  art.save();
  art.translate(x, y);
  art.rotate(-0.18);
  const ribs = new Path2D('M-83 7 Q-48 -3 20 1');
  for (let i = 0; i < 6; i++) {
    const ribX = -47 + i * 10;
    const span = 12 + i * 2;
    ribs.moveTo(ribX - 8, -span);
    ribs.quadraticCurveTo(ribX + 7, -span * 0.7, ribX, 0);
    ribs.quadraticCurveTo(ribX + 8, span * 0.7, ribX - 5, span);
  }
  art.lineWidth = 8;
  art.strokeStyle = '#755b43';
  art.stroke(ribs);
  art.lineWidth = 5;
  art.strokeStyle = '#ead4a2';
  art.stroke(ribs);
  art.lineWidth = 2.5;
  art.strokeStyle = '#755b43';
  drawShape(art, 'M14 -5 Q14 -19 29 -22 Q40 -24 49 -14 L67 -9 Q73 -5 69 2 L62 5 L60 10 L55 6 L51 11 L47 6 L39 7 L32 14 L22 11 Z', '#f1deb3');
  drawShape(art, 'M25 -8 Q25 -15 34 -15 Q42 -14 39 -8 Q35 -3 28 -4 Z', '#755b43', false);
  drawOval(art, 59, -4, 4, 2, '#755b43');
  drawShape(art, 'M22 20 Q37 23 52 17 L57 18 Q56 25 36 28 L24 26 Z', '#ead4a2');
  drawShape(art, 'M-45 38 Q-51 33 -47 30 Q-43 26 -39 32 L-21 37 Q-16 33 -13 38 Q-11 44 -18 46 Q-21 46 -24 43 L-41 38 Q-43 42 -45 38 Z', '#ead4a2');
  art.restore();
}

function drawCabin(art) {
  const { x, y, w, h, wall, doorWidth } = cabin;
  art.fillStyle = '#8f7553';
  art.fillRect(x + 4, y + 6, w, h);
  art.fillStyle = '#b58355';
  art.fillRect(x, y, w, h);
  for (let row = y + wall; row < frontY; row += 9) {
    art.fillStyle = '#966742';
    art.fillRect(x + wall, row, w - 2 * wall, 1);
  }
  art.fillStyle = '#67503a';
  art.fillRect(x + 21, y + 22, 37, 13);
  art.fillRect(x + w - 52, y + 22, 31, 13);
  art.fillStyle = '#677c55';
  art.fillRect(x + 59, y + 39, 46, 30);
  art.strokeStyle = '#9a9b6b';
  art.lineWidth = 2;
  art.strokeRect(x + 63, y + 43, 38, 22);
  for (const { x, y, w, h } of cabinWalls) {
    art.fillStyle = '#583d31';
    art.fillRect(x, y, w, h);
    art.fillStyle = '#aa754a';
    art.fillRect(x + 2, y + 2, w - 4, h - 5);
  }
  art.fillStyle = '#e1b878';
  art.fillRect(doorX, y + h - 3, doorWidth, 7);
  drawOval(art, doorX - 6, frontY + 6, 3, 3, '#ffdc89');
  drawOval(art, doorX + doorWidth + 6, frontY + 6, 3, 3, '#ffdc89');
}

function createCabinRoof() {
  const roof = document.createElement('canvas');
  roof.width = cabin.w + 12;
  roof.height = cabin.h;
  const art = roof.getContext('2d');
  art.strokeStyle = '#342d29';
  art.lineWidth = 3;
  art.lineJoin = 'round';
  drawShape(art, 'M3 4 L88 1 L173 4 L169 95 L7 95 Z', '#765044');
  drawShape(art, 'M5 6 L88 3 L88 87 L9 88 Z', '#a76b4c', false);
  drawShape(art, 'M88 3 L171 6 L167 88 L88 87 Z', '#875343', false);
  art.strokeStyle = '#70483a';
  art.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const edgeY = 21 + 12 * i;
    const ridgeY = 14 + 12 * i;
    art.beginPath();
    art.moveTo(9, edgeY);
    art.lineTo(88, ridgeY);
    art.lineTo(168, edgeY);
    art.stroke();
  }
  art.fillStyle = '#c28659';
  art.fillRect(85, 4, 6, 84);
  art.fillStyle = '#513c35';
  art.fillRect(118, 39, 15, 18);
  art.fillStyle = '#ad826a';
  art.fillRect(117, 36, 17, 6);
  return roof;
}

function createMap() {
  const map = document.createElement('canvas');
  map.width = worldWidth;
  map.height = worldHeight;
  const art = map.getContext('2d');
  art.lineCap = 'round';
  art.lineJoin = 'round';
  art.strokeStyle = '#354138';
  art.lineWidth = 2;

  const ground = art.createLinearGradient(0, 0, worldWidth, worldHeight);
  ground.addColorStop(0, '#355d3e');
  ground.addColorStop(0.5, '#476a42');
  ground.addColorStop(1, '#31563a');
  art.fillStyle = ground;
  art.fillRect(0, 0, worldWidth, worldHeight);

  // Stałe ziarno daje ten sam układ trawy i żwiru przy każdym otwarciu gry.
  let seed = 7123;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  }
  for (let i = 0; i < 1150; i++) {
    const x = random() * worldWidth;
    const y = random() * worldHeight;
    drawOval(art, x, y, 2 + random() * 7, 1 + random() * 2, i % 2 ? '#537348' : '#2d573b');
  }

  const trails = new Path2D('M-65 384 C280 368 440 397 650 384 S1060 367 1345 385 M650 384 V229 Q650 204 676 204 H934 Q960 204 960 179 V154 M650 384 V560 Q650 589 680 589 H1000');
  drawOval(art, 1000, 585, 116, 73, '#6e7850');
  art.strokeStyle = '#6e7850';
  art.lineWidth = 116;
  art.stroke(trails);
  drawOval(art, 1000, 585, 109, 66, '#a99163');
  art.strokeStyle = '#a99163';
  art.lineWidth = 100;
  art.stroke(trails);
  drawOval(art, 1000, 585, 101, 59, '#bd9f70');
  art.strokeStyle = '#bd9f70';
  art.lineWidth = 87;
  art.stroke(trails);
  for (let i = 0; i < 1200; i++) {
    const x = random() * worldWidth;
    const y = random() * worldHeight;
    if (art.isPointInStroke(trails, x, y) || Math.hypot((x - 1000) / 99, (y - 585) / 56) < 1) {
      drawOval(art, x, y, 1 + random() * 3, 1, i % 2 ? '#ceb181' : '#a88d64');
    }
  }

  for (const thicket of thickets) drawThicket(art, thicket);
  for (const [x, y, radius] of trees) drawTree(art, x, y, radius);
  for (const [x, y, length] of [[34, 222, 74], [204, 211, 62], [480, 256, 75], [759, 265, 73], [1197, 261, 62], [211, 511, 74], [850, 478, 71], [1107, 57, 61]]) {
    drawVine(art, x, y - 23, length);
  }
  art.strokeStyle = '#354138';
  art.lineWidth = 2;
  for (const rock of rocks) drawRock(art, rock);
  drawFossil(art, 1001, 577);
  drawCabin(art);
  return map;
}

const map = createMap();
const cabinRoof = createCabinRoof();
