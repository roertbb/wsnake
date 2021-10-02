import React from "react";
import QRCode from "react-qr-code";

function PreviewerLobby({ lobby, gameId }) {
  const { players, maxPlayers } = lobby;
  const availableSlots = maxPlayers - players.length;
  const token = localStorage.getItem("token");
  const joinGameUrl = `${window.location.origin}/join?id=${gameId}`;

  return (
    <div className="menu">
      <h1>wsnake</h1>

      <div className="col">
        <div className="row row__qrcode">
          <div className="qrcode-wrapper">
            <QRCode value={joinGameUrl} />
          </div>

          <h2>Scan and play!</h2>
        </div>

        <div className="row">
          <p>players in lobby:</p>
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
        </div>
      </div>
    </div>
  );
}

export default PreviewerLobby;
