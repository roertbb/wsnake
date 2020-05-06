import React from "react";

function Lobby({ lobby, onPlayerReady }) {
  const { players, maxPlayers } = lobby;

  return (
    <div>
      <h1>wsnake - lobby</h1>
      <p>players:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{JSON.stringify(player)}</li>
        ))}
      </ul>
      <button onClick={onPlayerReady}>Ready!</button>
    </div>
  );
}

export default Lobby;
