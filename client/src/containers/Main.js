import React from "react";

function Main({ games, onGameJoin, onCreateNewGame }) {
  return (
    <div className="menu">
      <h1>wsnake</h1>

      {games.length ? (
        <div className="menu__container">
          <p>games:</p>
          <ul>
            {games.map(({ id, players, maxPlayers, inProgress }) => {
              const name = id;
              const classes = ["btn", inProgress && "btn--disabled"]
                .filter(Boolean)
                .join(" ");

              return (
                <li onClick={() => !inProgress && onGameJoin(id)} key={id}>
                  <button className={classes}>
                    {name} - {players}/{maxPlayers}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="menu__container">
          <p>no available games</p>
          <p>- create new game -</p>
        </div>
      )}
      <button className="btn" onClick={onCreateNewGame}>
        create new game
      </button>
    </div>
  );
}

export default Main;
