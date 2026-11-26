// Wspólna geometria ruchu, pocisków i wyznaczania drogi.
function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x
    && a.y < b.y + b.h && a.y + a.h > b.y;
}

function canStand(x, y, size = playerSize) {
  return x >= 0 && y >= 0 && x + size <= worldWidth && y + size <= worldHeight
    && !obstacles.some(obstacle => overlaps({ x, y, w: size, h: size }, obstacle));
}

// Parametr pierwszego trafienia na odcinku, także przy szybkim pocisku.
function segmentHit(x1, y1, x2, y2, rect, padding = 0) {
  let enter = 0;
  let exit = 1;
  for (const [start, delta, min, max] of [
    [x1, x2 - x1, rect.x - padding, rect.x + rect.w + padding],
    [y1, y2 - y1, rect.y - padding, rect.y + rect.h + padding],
  ]) {
    if (Math.abs(delta) < 0.000001) {
      if (start < min || start > max) return Infinity;
    } else {
      const a = (min - start) / delta;
      const b = (max - start) / delta;
      enter = Math.max(enter, Math.min(a, b));
      exit = Math.min(exit, Math.max(a, b));
      if (enter > exit) return Infinity;
    }
  }
  return enter;
}

function clearRoute(x1, y1, x2, y2) {
  // Stykanie się bokiem ze ścianą jest dozwolone, tak jak w kolizjach ruchu.
  return !obstacles.some(obstacle => segmentHit(x1, y1, x2, y2, obstacle, playerSize / 2 - 0.001) !== Infinity);
}

// Jedno pole odległości do gracza obsługuje wszystkie zombie. Siatka powstaje raz.
const navigation = { step: 16, nodes: [], distances: [], cooldown: 0, target: -1 };
const gridColumns = worldWidth / navigation.step;
const gridRows = worldHeight / navigation.step;
for (let row = 0; row < gridRows; row++) {
  for (let column = 0; column < gridColumns; column++) {
    const x = column * navigation.step + navigation.step / 2;
    const y = row * navigation.step + navigation.step / 2;
    navigation.nodes.push({ x, y, neighbors: [], walkable: canStand(x - playerSize / 2, y - playerSize / 2) });
  }
}
navigation.nodes.forEach((node, index) => {
  if (!node.walkable) return;
  const column = index % gridColumns;
  const candidates = [index - gridColumns, index + gridColumns];
  if (column > 0) candidates.push(index - 1);
  if (column < gridColumns - 1) candidates.push(index + 1);
  for (const next of candidates) {
    const neighbor = navigation.nodes[next];
    if (neighbor?.walkable && clearRoute(node.x, node.y, neighbor.x, neighbor.y)) node.neighbors.push(next);
  }
});

function nearestNode(x, y) {
  const column = Math.floor(x / navigation.step);
  const row = Math.floor(y / navigation.step);
  const candidates = [];
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const c = column + dx;
      const r = row + dy;
      if (c < 0 || c >= gridColumns || r < 0 || r >= gridRows) continue;
      const index = r * gridColumns + c;
      const node = navigation.nodes[index];
      if (node.walkable) candidates.push({ index, distance: (x - node.x) ** 2 + (y - node.y) ** 2 });
    }
  }
  candidates.sort((a, b) => a.distance - b.distance);
  for (const { index } of candidates) {
    const node = navigation.nodes[index];
    if (clearRoute(x, y, node.x, node.y)) return index;
  }
  return -1;
}

function updateNavigation(seconds, force = false) {
  navigation.cooldown -= seconds;
  if (!force && navigation.cooldown > 0) return;
  navigation.cooldown = 0.25;
  const center = playerCenter();
  const target = nearestNode(center.x, center.y);
  if (!force && target === navigation.target) return;
  navigation.target = target;
  navigation.distances = new Array(navigation.nodes.length).fill(-1);
  if (target < 0) return;
  const queue = [target];
  navigation.distances[target] = 0;
  for (let head = 0; head < queue.length; head++) {
    const index = queue[head];
    for (const next of navigation.nodes[index].neighbors) {
      if (navigation.distances[next] !== -1) continue;
      navigation.distances[next] = navigation.distances[index] + 1;
      queue.push(next);
    }
  }
}
