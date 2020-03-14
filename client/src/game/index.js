const state = { x: 0 };

export function initGame(canvas) {
  const ctx = canvas.getContext("2d");

  // listen on socket
  // listen on key press

  renderGame(ctx);
}

function renderGame(ctx) {
  ctx.fillStyle = "#999";
  ctx.fillRect(0, 0, 500, 500);

  ctx.fillStyle = "#900";
  ctx.fillRect(state.x, 0, 30, 30);

  state.x++;

  requestAnimationFrame(renderGame.bind(null, ctx));
}
