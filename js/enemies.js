function spawnZombies(settings) {
  updateNavigation(0, true);
  const center = playerCenter();
  const candidates = navigation.nodes.filter((node, index) => node.walkable
    && navigation.distances[index] >= 0 && !isInsideCabin(node.x, node.y)
    && Math.hypot(node.x - center.x, node.y - center.y) >= 200);
  // Przetasowanie bez nieskończonego losowania miejsc w przeszkodach.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  for (const node of candidates) {
    if (zombies.length >= settings.count) break;
    if (zombies.some(zombie => Math.hypot(zombie.x + 14 - node.x, zombie.y + 14 - node.y) < 32)) continue;
    zombies.push({ x: node.x - 14, y: node.y - 14, size: 28,
      health: settings.health, maxHealth: settings.health, speed: settings.speed,
      waypoint: null, flash: 0 });
  }
}

function zombieTarget(zombie, center) {
  const x = zombie.x + zombie.size / 2;
  const y = zombie.y + zombie.size / 2;
  if (clearRoute(x, y, center.x, center.y)) {
    zombie.waypoint = null;
    return center;
  }
  if (zombie.waypoint && Math.hypot(zombie.waypoint.x - x, zombie.waypoint.y - y) > 0.5) return zombie.waypoint;
  const index = nearestNode(x, y);
  if (index < 0) return { x, y };
  const node = navigation.nodes[index];
  if (Math.hypot(node.x - x, node.y - y) > 0.5) {
    zombie.waypoint = node;
  } else {
    const next = node.neighbors.find(neighbor => navigation.distances[neighbor] >= 0
      && navigation.distances[neighbor] < navigation.distances[index]);
    zombie.waypoint = next === undefined ? null : navigation.nodes[next];
  }
  return zombie.waypoint || { x, y };
}

function updateZombies(seconds) {
  updateNavigation(seconds);
  const center = playerCenter();
  for (const zombie of zombies) {
    zombie.flash = Math.max(0, zombie.flash - seconds);
    const target = zombieTarget(zombie, center);
    const dx = target.x - zombie.x - zombie.size / 2;
    const dy = target.y - zombie.y - zombie.size / 2;
    const length = Math.hypot(dx, dy);
    if (length > 0.01) {
      const distance = Math.min(length, zombie.speed * seconds);
      zombie.x = pozycjaPoRuchu('x', dx / length * distance, zombie);
      zombie.y = pozycjaPoRuchu('y', dy / length * distance, zombie);
    }
    if (game.invulnerable <= 0 && overlaps(
      { x: player.x, y: player.y, w: playerSize, h: playerSize },
      { x: zombie.x, y: zombie.y, w: zombie.size, h: zombie.size },
    )) {
      game.health--;
      game.invulnerable = 1;
      if (game.health <= 0) {
        finishGame('lost');
        return;
      }
    }
  }
}

function drawZombie(zombie) {
  context.save();
  context.translate(zombie.x, zombie.y);
  context.lineWidth = 1.5;
  context.strokeStyle = outlineColor;
  drawOval(context, 14, 25, 13, 4, '#193b33');
  context.fillStyle = '#72538b';
  context.fillRect(5, 15, 18, 10);
  drawOval(context, 3, 17, 4, 3, '#8cb76b', true);
  drawOval(context, 25, 17, 4, 3, '#8cb76b', true);
  drawOval(context, 14, 10, 12, 10, zombie.flash > 0 ? '#fff2c4' : '#9dca79', true);
  drawOval(context, 9, 8, 3, 3.5, '#fff5dc');
  drawOval(context, 19, 8, 3, 3.5, '#fff5dc');
  drawOval(context, 10, 9, 1.3, 2, outlineColor);
  drawOval(context, 18, 9, 1.3, 2, outlineColor);
  context.fillStyle = outlineColor;
  context.fillRect(9, 15, 10, 2);
  context.fillStyle = '#fff5dc';
  context.fillRect(12, 15, 3, 3);
  context.fillStyle = '#24352e';
  context.fillRect(1, -6, 26, 3);
  context.fillStyle = '#b8e87c';
  context.fillRect(1, -6, 26 * zombie.health / zombie.maxHealth, 3);
  context.restore();
}
