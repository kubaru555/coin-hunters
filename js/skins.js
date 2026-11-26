function drawEyes(canvasContext, y) {
  drawOval(canvasContext, 24, y, 2.4, 3.5, outlineColor);
  drawOval(canvasContext, 40, y, 2.4, 3.5, outlineColor);
}

const drawSkin = {
  wolf(art) {
    // Korpus i ogon.
    drawShape(art, 'M39 53 Q52 54 56 45 Q62 49 58 56 Q53 62 41 59 Z', '#78899a');
    drawOval(art, 32, 51, 15, 11, '#78899a', true);
    drawOval(art, 32, 54, 8, 6, '#e9eef0');
    // Uszy są częścią konturu głowy.
    drawShape(art, 'M10 28 L9 8 Q9 4 13 6 L25 16 Q32 14 39 16 L51 6 Q55 4 55 8 L54 28 Q61 35 59 43 L54 42 Q48 52 32 52 Q16 52 10 42 L5 43 Q3 35 10 28 Z', '#9caebe');
    drawShape(art, 'M14 12 L21 19 L15 24 Z M50 12 L43 19 L49 24 Z', '#eaaab3', false);
    drawShape(art, 'M11 36 Q20 30 32 38 Q44 30 53 36 Q51 49 32 50 Q13 49 11 36 Z', '#e9eef0', false);
    drawEyes(art, 30);
    drawShape(art, 'M27 38 Q32 36 37 38 Q37 43 32 44 Q27 43 27 38 Z', outlineColor, false);
  },
  duck(art) {
    // Ogon, stopy i kolce zielonego kostiumu.
    drawShape(art, 'M39 51 Q53 53 59 45 Q60 56 48 59 L41 59 Z', '#4eb67c');
    drawOval(art, 23, 57, 7, 4, '#ffc343', true);
    drawOval(art, 42, 57, 7, 4, '#ffc343', true);
    drawOval(art, 32, 49, 17, 11, '#4eb67c', true);
    drawOval(art, 32, 51, 8, 7, '#bce779');
    drawShape(art, 'M15 18 Q13 13 16 9 Q20 9 24 12 Q23 5 28 3 Q33 4 35 11 Q40 4 45 6 Q47 9 45 15 Q51 11 55 15 Q55 20 51 24 Z', '#d6ee78');
    drawOval(art, 32, 29, 23, 19, '#4eb67c', true);
    drawOval(art, 32, 33, 17, 13, '#fff2d5', true);
    drawEyes(art, 29);
    drawShape(art, 'M21 39 Q26 34 32 36 Q38 34 43 39 Q46 45 34 47 Q22 47 21 42 Z', '#ffc343');
    drawShape(art, 'M24 41 Q33 44 41 40 Q35 46 24 42 Z', '#a55729', false);
  },
  bear(art) {
    drawShape(art, 'M12 56 Q12 43 24 41 L40 41 Q52 43 52 56 L50 61 L14 61 Z', '#304b78');
    drawShape(art, 'M21 44 L32 46 L43 44 L32 60 Z', '#fff1d8', false);
    drawShape(art, 'M30 46 L34 46 L35 55 L32 59 L29 55 Z', '#df515d', false);
    drawShape(art, 'M20 44 L28 56 L21 52 L17 47 Z M44 44 L36 56 L43 52 L47 47 Z', '#6483ae', false);
    drawOval(art, 14, 16, 9, 9, '#b97951', true);
    drawOval(art, 50, 16, 9, 9, '#b97951', true);
    drawOval(art, 14, 16, 4.5, 4.5, '#e9ae86');
    drawOval(art, 50, 16, 4.5, 4.5, '#e9ae86');
    drawOval(art, 32, 28, 23, 18, '#c98b61', true);
    drawOval(art, 32, 35, 12, 8, '#f2c796');
    drawEyes(art, 25);
    drawShape(art, 'M27 32 Q32 30 37 32 Q36 37 32 37 Q28 37 27 32 Z', outlineColor, false);
  },
  dinosaur(art) {
    // Zielony ogon wystaje spod szarego przebrania.
    drawShape(art, 'M39 50 Q47 52 52 50 L54 46 L56 48 L60 44 Q63 56 47 59 L40 58 Z', '#7ac56d');
    drawOval(art, 32, 51, 16, 11, '#9ba6bd', true);
    drawOval(art, 32, 54, 8, 6, '#cbd2e0');
    drawOval(art, 13, 24, 10, 15, '#9ba6bd', true);
    drawOval(art, 51, 24, 10, 15, '#9ba6bd', true);
    drawOval(art, 13, 24, 5, 10, '#edb2ca');
    drawOval(art, 51, 24, 5, 10, '#edb2ca');
    drawOval(art, 32, 24, 19, 19, '#b8c3d6', true);
    drawOval(art, 31, 34, 14, 12, '#7ac56d', true);
    drawOval(art, 25, 29, 2.4, 3.5, outlineColor);
    drawShape(art, 'M21 38 Q23 34 29 36 Q36 37 35 42 Q33 47 25 45 Q18 44 21 38 Z', '#b7e77f');
    drawOval(art, 24, 39, 1.4, 1.2, outlineColor);
    drawShape(art, 'M27 44 L32 44 L29 48 Z', '#fff2d5', false);
    drawShape(art, 'M39 19 Q46 17 48 25 L48 39 Q49 44 53 41 Q56 39 58 43 Q58 49 51 50 Q42 51 40 43 L38 27 Q36 21 39 19 Z', '#b8c3d6');
  },
};

// Punkty pyska w oryginalnych rysunkach 64 × 64.
const skinMouths = {
  wolf: { x: 32, y: 44 }, duck: { x: 32, y: 43 },
  bear: { x: 32, y: 37 }, dinosaur: { x: 27, y: 43 },
};

function mouthPosition() {
  const mouth = skinMouths[selectedButton.dataset.skin];
  const x = (mouth.x - 32) * playerSize / 64;
  const y = (mouth.y - 32) * playerSize / 64;
  const rotation = player.angle - Math.PI / 2;
  const center = playerCenter();
  return {
    x: center.x + x * Math.cos(rotation) - y * Math.sin(rotation),
    y: center.y + x * Math.sin(rotation) + y * Math.cos(rotation),
  };
}

let selectedButton = document.querySelector('.skin-option[aria-pressed="true"]');
let playerSprite = selectedButton.querySelector('canvas');

for (const button of document.querySelectorAll('.skin-option')) {
  const preview = button.querySelector('canvas');
  const art = preview.getContext('2d');
  // Rysunki mają współrzędne 64 × 64. Plansza korzysta z gotowego podglądu.
  art.scale(preview.width / 64, preview.height / 64);
  art.strokeStyle = outlineColor;
  art.lineWidth = 2.5;
  art.lineJoin = 'round';
  drawSkin[button.dataset.skin](art);

  button.addEventListener('click', () => {
    if (button === selectedButton) return;
    selectedButton.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', 'true');
    selectedButton = button;
    playerSprite = preview;
    narysujMape();
  });
}
