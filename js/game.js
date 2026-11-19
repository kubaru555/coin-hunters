function narysujMape() {
  const centerX = player.x + playerSize / 2;
  const centerY = player.y + playerSize / 2;
  const cameraX = Math.round(Math.max(0, Math.min(centerX - board.width / 2, worldWidth - board.width)));
  const cameraY = Math.round(Math.max(0, Math.min(centerY - board.height / 2, worldHeight - board.height)));
  context.drawImage(map, cameraX, cameraY, board.width, board.height, 0, 0, board.width, board.height);
  context.drawImage(playerSprite, player.x - cameraX, player.y - cameraY, playerSize, playerSize);

  // Dach odsłania wnętrze, gdy środek postaci przekroczy próg.
  const insideCabin = centerX > cabin.x + cabin.wall && centerX < cabin.x + cabin.w - cabin.wall
    && centerY > cabin.y + cabin.wall && centerY < cabin.y + cabin.h;
  if (!insideCabin) context.drawImage(cabinRoof, cabin.x - 6 - cameraX, cabin.y - cameraY);
}

let previousTime;
function aktualizujKlatke(time) {
  if (previousTime !== undefined) {
    const seconds = Math.min((time - previousTime) / 1000, 0.05);
    przesunPostac(seconds);
  }
  previousTime = time;
  narysujMape();
  requestAnimationFrame(aktualizujKlatke);
}

requestAnimationFrame(aktualizujKlatke);
