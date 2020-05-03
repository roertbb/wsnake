import React, { useEffect } from "react";
import { getSocket } from "../ws";

const Lobby = () => {
  const socket = getSocket();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div>
      <p>Lobby</p>
    </div>
  );
};

export default Lobby;
