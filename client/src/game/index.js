const blockSize = 32;
const boardSize = 20;

const code2color = {
  1: "#0f0",
  2: "#f00",
  3: "#00f",
  4: "#f66",
};

export function initGame(canvas, gameState) {
  const ctx = canvas.getContext("2d");

  // listen on socket
  // listen on key press

  renderGame(ctx, gameState);
}

function renderGame(ctx, gameState) {
  ctx.fillStyle = "#999";
  ctx.fillRect(0, 0, boardSize * blockSize, boardSize * blockSize);

  const lines = gameState.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const elems = lines[y].split("");

    for (let x = 0; x < elems.length; x++) {
      if (elems[x] !== "0") {
        ctx.fillStyle = code2color[elems[x]];
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    }
  }

  // requestAnimationFrame(renderGame.bind(null, ctx, gameState));
}
