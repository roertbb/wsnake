import React, { useEffect, useRef } from "react";
import { initGame } from "../game";
import { userInput } from "../ws/events";

const key2Code = {
  ArrowRight: "right",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowUp: "up",
};

function Game({ socket, gameState, score }) {
  const canvas = useRef(null);

  useEffect(() => {
    initGame(canvas.current, gameState);
  }, [gameState]);

  useEffect(() => {
    function arrowKeyHandler(event) {
      if (Object.keys(key2Code).includes(event.code)) {
        const direction = key2Code[event.code];
        socket.send(userInput(direction));
      }
    }

    window.addEventListener("keydown", arrowKeyHandler);
    return () => {
      window.removeEventListener("keydown", arrowKeyHandler);
    };
  }, [socket]);

  return (
    <>
      <div class="container">
        <div class="screen">
          <div class="screen__overlay"></div>
          <canvas width="640" height="640" ref={canvas} />
        </div>

        <ul className="points">
          {score.map(({ color, score }) => {
            return (
              <li className={`points__point points__point--${color}`}>
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
