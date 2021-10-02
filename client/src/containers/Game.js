import React, { useEffect, useRef } from "react";
import { initGame } from "../game";
import { userInput } from "../ws/events";

const key2Code = {
  39: "right",
  40: "down",
  37: "left",
  38: "up",
  68: "right",
  83: "down",
  65: "left",
  87: "up",
};

function sortScore(a, b) {
  if (b.score > a.score) return 1;
  return -1;
}

function Game({ socket, gameState, score, previewer }) {
  const canvas = useRef(null);

  useEffect(() => {
    initGame(canvas.current, gameState);
  }, [gameState]);

  useEffect(() => {
    function arrowKeyHandler(event) {
      const code = String(event.keyCode || event.which);

      if (Object.keys(key2Code).includes(code)) {
        const direction = key2Code[code];
        socket.send(userInput(direction));
      }
    }

    if (!previewer) {
      window.addEventListener("keydown", arrowKeyHandler);
    }

    return () => {
      if (!previewer) {
        window.removeEventListener("keydown", arrowKeyHandler);
      }
    };
  }, [socket, previewer]);

  return (
    <>
      <div className="container">
        <div className="screen">
          <div className="screen__overlay"></div>
          <canvas width="640" height="640" ref={canvas} />
        </div>

        <ul className="points">
          {score.sort(sortScore).map(({ color, score }) => {
            return (
              <li
                key={color}
                className={`points__point points__point--${color}`}
              >
                {score}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Game;
