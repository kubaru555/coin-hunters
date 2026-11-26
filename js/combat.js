function updateCombat(seconds) {
  game.shotCooldown = Math.max(0, game.shotCooldown - seconds);
  if (pointer.down && game.shotCooldown <= 0.000001) {
    const center = playerCenter();
    bullets.push({ x: center.x, y: center.y, angle: player.angle,
      damage: weapons[game.weapon].damage, weapon: game.weapon, life: 2.5 });
    game.shotCooldown = 0.3;
  }
  for (let index = bullets.length - 1; index >= 0; index--) {
    const bullet = bullets[index];
    const nextX = bullet.x + Math.cos(bullet.angle) * 420 * seconds;
    const nextY = bullet.y + Math.sin(bullet.angle) * 420 * seconds;
    let firstHit = Infinity;
    let target = null;
    for (const obstacle of obstacles) {
      firstHit = Math.min(firstHit, segmentHit(bullet.x, bullet.y, nextX, nextY, obstacle, 3));
    }
    for (const zombie of zombies) {
      const hit = segmentHit(bullet.x, bullet.y, nextX, nextY,
        { x: zombie.x, y: zombie.y, w: zombie.size, h: zombie.size }, 3);
      if (hit < firstHit) {
        firstHit = hit;
        target = zombie;
      }
    }
    bullet.life -= seconds;
    if (firstHit !== Infinity) {
      if (target) {
        target.health -= bullet.damage;
        target.flash = 0.12;
        if (target.health <= 0) {
          coins.push({ x: target.x + target.size / 2, y: target.y + target.size / 2, flight: null });
          zombies.splice(zombies.indexOf(target), 1);
        }
      }
      bullets.splice(index, 1);
    } else if (bullet.life <= 0 || nextX < 0 || nextY < 0 || nextX > worldWidth || nextY > worldHeight) {
      bullets.splice(index, 1);
    } else {
      bullet.x = nextX;
      bullet.y = nextY;
    }
  }
}

function drawBone(art, x, y, scale, color) {
  art.save();
  art.translate(x, y);
  art.scale(scale, scale);
  art.fillStyle = color;
  art.fillRect(-4, -2, 8, 4);
  for (const side of [-1, 1]) {
    drawOval(art, side * 4, -2, 2.3, 2.3, color);
    drawOval(art, side * 4, 2, 2.3, 2.3, color);
  }
  art.restore();
}

function drawBullet(bullet) {
  if (bullet.weapon === 0) {
    drawOval(context, bullet.x, bullet.y, 4, 4, weapons[0].color);
  } else {
    context.save();
    context.translate(bullet.x, bullet.y);
    context.rotate(bullet.angle);
    drawBone(context, 0, 0, 1, weapons[bullet.weapon].color);
    context.restore();
  }
}
