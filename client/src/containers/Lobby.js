import React from "react";

function Lobby({ lobby, onPlayerReady }) {
  const { players, maxPlayers } = lobby;
  const availableSlots = maxPlayers - players.length;
  const token = localStorage.getItem("token");

  return (
    <div className="menu">
      <h1>lobby</h1>
      <p>players:</p>
      <ul>
        {players.map(({ id, ready, color }) => {
          const classes = [
            "btn",
            `btn--${color}`,
            !ready && `btn--${color}--disabled`,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li className={classes} key={id}>
              {id === token && "you're -> "}
              {color}
            </li>
          );
        })}
        {new Array(availableSlots).fill(0).map((_, idx) => (
          <li key={idx}>
            <button className="btn btn--empty">-</button>
          </li>
        ))}
      </ul>
      <p>mark when your ready</p>
      <button className="btn" onClick={onPlayerReady}>
        ready
      </button>
    </div>
  );
}

export default Lobby;
