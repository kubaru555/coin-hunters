function cameraPosition() {
  const center = playerCenter();
  return {
    x: Math.round(Math.max(0, Math.min(center.x - board.width / 2, worldWidth - board.width))),
    y: Math.round(Math.max(0, Math.min(center.y - board.height / 2, worldHeight - board.height))),
  };
}

function drawPlayer() {
  const center = playerCenter();
  context.save();
  context.translate(center.x, center.y);
  if (game.invulnerable > 0 && Math.floor(game.invulnerable * 12) % 2 === 0) context.globalAlpha = 0.4;
  context.rotate(player.angle - Math.PI / 2);
  context.drawImage(playerSprite, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
  // Lufa wskazuje przód rysunku (dół), a następnie obraca się razem z nim.
  context.fillStyle = '#24352e';
  context.fillRect(6, 1, 9, 19);
  context.fillStyle = weapons[game.weapon].color;
  context.fillRect(8, 2, 5, 16);
  context.restore();
}

function drawCabinGuide(camera) {
  if (game.stage !== 'break') return;
  const target = { x: cabin.x + cabin.w / 2, y: cabin.y + cabin.h + 24 };
  const x = Math.max(28, Math.min(board.width - 28, target.x - camera.x));
  const y = Math.max(28, Math.min(board.height - 28, target.y - camera.y));
  context.save();
  context.translate(x, y);
  context.rotate(Math.atan2(target.y - camera.y - y, target.x - camera.x - x) || -Math.PI / 2);
  context.fillStyle = '#ffe593';
  context.strokeStyle = '#25372d';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(13, 0);
  context.lineTo(-6, -9);
  context.lineTo(-6, 9);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
  context.font = 'bold 12px system-ui';
  context.textAlign = 'center';
  context.fillStyle = '#ffe593';
  context.strokeStyle = '#17222c';
  context.lineWidth = 3;
  context.strokeText('SKLEP', x, y + 22);
  context.fillText('SKLEP', x, y + 22);
}

function narysujMape() {
  const center = playerCenter();
  const camera = cameraPosition();
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(map, camera.x, camera.y, board.width, board.height, 0, 0, board.width, board.height);
  context.save();
  context.translate(-camera.x, -camera.y);
  for (const coin of coins) if (!coin.flight) drawCoin(coin);
  if (pressedKeys.has('e') && !game.paused && ['wave', 'break'].includes(game.stage)) {
    context.strokeStyle = '#ffe59380';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(center.x, center.y, 48, 0, Math.PI * 2);
    context.stroke();
  }
  const actors = [...zombies.map(zombie => ({ y: zombie.y + zombie.size, zombie })),
    { y: player.y + playerSize, zombie: null }].sort((a, b) => a.y - b.y);
  for (const actor of actors) actor.zombie ? drawZombie(actor.zombie) : drawPlayer();
  for (const bullet of bullets) drawBullet(bullet);
  if (!isInsideCabin(center.x, center.y)) context.drawImage(cabinRoof, cabin.x - 6, cabin.y);
  // Lot do pyska i +1 są zawsze czytelne nad postacią.
  for (const coin of coins) if (coin.flight) drawCoin(coin);
  context.font = 'bold 18px system-ui';
  context.textAlign = 'center';
  for (const text of floatingTexts) {
    context.globalAlpha = Math.min(1, text.life * 3);
    context.strokeStyle = '#17222c';
    context.lineWidth = 3;
    context.strokeText('+1', text.x, text.y);
    context.fillStyle = '#ffe593';
    context.fillText('+1', text.x, text.y);
  }
  context.restore();
  drawCabinGuide(camera);
}

function updateGame(seconds) {
  if (game.paused) return;
  if (game.stage === 'won' || game.stage === 'lost') {
    updateLoot(seconds, false);
    return;
  }
  if (!['wave', 'break'].includes(game.stage)) return;
  game.elapsed += seconds;
  game.invulnerable = Math.max(0, game.invulnerable - seconds);
  przesunPostac(seconds);
  if (pointer.aiming) {
    const camera = cameraPosition();
    const center = playerCenter();
    player.angle = Math.atan2(pointer.y + camera.y - center.y, pointer.x + camera.x - center.x);
  }
  if (game.stage === 'wave') {
    updateZombies(seconds);
    if (game.stage === 'lost') return;
    updateCombat(seconds);
    updateLoot(seconds);
    if (zombies.length === 0) completeWave();
  } else {
    updateLoot(seconds);
  }
}

let previousTime;
function aktualizujKlatke(time) {
  if (previousTime !== undefined) updateGame(Math.min((time - previousTime) / 1000, 0.05));
  previousTime = time;
  updateInterface();
  narysujMape();
  requestAnimationFrame(aktualizujKlatke);
}

updateInterface();
requestAnimationFrame(aktualizujKlatke);
