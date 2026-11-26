function updateLoot(seconds, allowPickup = true) {
  game.pickupCooldown = Math.max(0, game.pickupCooldown - seconds);
  const center = playerCenter();
  if (allowPickup && pressedKeys.has('e') && game.pickupCooldown <= 0.000001) {
    const nearby = coins.filter(coin => !coin.flight
      && Math.hypot(coin.x - center.x, coin.y - center.y) <= 48
      && !obstacles.some(obstacle => segmentHit(center.x, center.y, coin.x, coin.y, obstacle) !== Infinity));
    nearby.sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y));
    if (nearby.length) {
      const coin = nearby[0];
      coin.flight = { x: coin.x, y: coin.y, progress: 0 };
      game.pickupCooldown = 0.15;
    }
  }
  const mouth = mouthPosition();
  for (let index = coins.length - 1; index >= 0; index--) {
    const coin = coins[index];
    if (!coin.flight) continue;
    coin.flight.progress = Math.min(1, coin.flight.progress + seconds / 0.25);
    const progress = coin.flight.progress;
    coin.x = coin.flight.x + (mouth.x - coin.flight.x) * progress;
    coin.y = coin.flight.y + (mouth.y - coin.flight.y) * progress;
    if (progress >= 1) {
      coins.splice(index, 1);
      game.coins++;
      floatingTexts.push({ x: center.x, y: center.y - 24, life: 0.8 });
    }
  }
  for (let index = floatingTexts.length - 1; index >= 0; index--) {
    floatingTexts[index].life -= seconds;
    floatingTexts[index].y -= 20 * seconds;
    if (floatingTexts[index].life <= 0) floatingTexts.splice(index, 1);
  }
}

function drawCoin(coin) {
  drawOval(context, coin.x, coin.y + 2, 9, 8, '#765321');
  drawOval(context, coin.x, coin.y, 9, 9, '#ffc94d');
  drawOval(context, coin.x, coin.y, 7, 7, '#ffe593');
  drawBone(context, coin.x, coin.y, 0.8, '#9b651f');
}
