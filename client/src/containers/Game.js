import React, { useEffect, useRef } from "react";
import { initGame } from "../game";

const Game = () => {
  const canvas = useRef(null);

  useEffect(() => {
    initGame(canvas.current);
  }, []);

  return <canvas width="500" height="500" ref={canvas} />;
};

export default Game;
