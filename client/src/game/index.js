const blockSize = 32;
const boardSize = 20;

const code2color = {
  1: "#d66",
  2: "#ddd",
  3: "#6d6",
  4: "#66d",
  5: "#d6d",
  6: "#dd6",
  7: "#6dd",
};

export function initGame(canvas, gameState) {
  const ctx = canvas.getContext("2d");
  renderGame(ctx, gameState);
}

function renderGame(ctx, gameState) {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, boardSize * blockSize, boardSize * blockSize);

  const lines = gameState.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const elems = lines[y].split("");

    for (let x = 0; x < elems.length; x++) {
      if (elems[x] !== "0") {
        ctx.fillStyle = code2color[elems[x]];
        ctx.shadowBlur = 15;
        ctx.shadowColor = code2color[elems[x]];
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    }
  }
}
