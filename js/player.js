function pozycjaPoRuchu(axis, distance, entity = player) {
  const horizontal = axis === 'x';
  const otherAxis = horizontal ? 'y' : 'x';
  const size = horizontal ? 'w' : 'h';
  const otherSize = horizontal ? 'h' : 'w';
  const limit = (horizontal ? worldWidth : worldHeight) - entity.size;
  const start = entity[axis];
  const side = entity[otherAxis];
  let end = Math.max(0, Math.min(start + distance, limit));

  // Zatrzymaj gracza na najbliższej krawędzi przeszkody na tej osi.
  for (const obstacle of obstacles) {
    if (side + entity.size <= obstacle[otherAxis] || side >= obstacle[otherAxis] + obstacle[otherSize]) continue;
    const near = obstacle[axis] - entity.size;
    const far = obstacle[axis] + obstacle[size];
    if (distance > 0 && start <= near) end = Math.min(end, near);
    if (distance < 0 && start >= far) end = Math.max(end, far);
  }
  return end;
}

function przesunPostac(seconds) {
  const activeDirections = new Set();
  for (const key of pressedKeys) {
    activeDirections.add(directions[key]);
  }

  let horizontal = Number(activeDirections.has('right')) - Number(activeDirections.has('left'));
  let vertical = Number(activeDirections.has('down')) - Number(activeDirections.has('up'));

  // Na skos postać pokonuje tę samą odległość co w poziomie lub w pionie.
  if (horizontal !== 0 && vertical !== 0) {
    horizontal /= Math.SQRT2;
    vertical /= Math.SQRT2;
  }

  if (horizontal !== 0) player.x = pozycjaPoRuchu('x', horizontal * playerSpeed * seconds);
  if (vertical !== 0) player.y = pozycjaPoRuchu('y', vertical * playerSpeed * seconds);
}
