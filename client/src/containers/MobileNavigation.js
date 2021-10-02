import React from "react";
import { userInput } from "../ws/events";

function MobileNavigation({ socket }) {
  function handleArrowClicked(direction) {
    socket.send(userInput(direction));
  }

  return (
    <div className="menu arrow-wrapper">
      <button
        className="arrow-button arrow-left"
        onClick={() => handleArrowClicked("left")}
      ></button>
      <button
        className="arrow-button arrow-up"
        onClick={() => handleArrowClicked("up")}
      ></button>
      <button
        className="arrow-button arrow-right"
        onClick={() => handleArrowClicked("right")}
      ></button>
      <button
        className="arrow-button arrow-down"
        onClick={() => handleArrowClicked("down")}
      ></button>
    </div>
  );
}

export default MobileNavigation;
