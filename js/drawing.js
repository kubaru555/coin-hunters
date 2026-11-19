const outlineColor = '#17222c';

function drawShape(canvasContext, path, color, outlined = true) {
  const shape = new Path2D(path);
  canvasContext.fillStyle = color;
  canvasContext.fill(shape);
  if (outlined) canvasContext.stroke(shape);
}

function drawOval(canvasContext, x, y, radiusX, radiusY, color, outlined = false) {
  canvasContext.beginPath();
  canvasContext.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  canvasContext.fillStyle = color;
  canvasContext.fill();
  if (outlined) canvasContext.stroke();
}
