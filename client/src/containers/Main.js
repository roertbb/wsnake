import React from "react";

function Main({ games, onGameJoin, onCreateNewGame }) {
  return (
    <div>
      <h1>wsnake</h1>
      <p>available games:</p>
      <ul>
        {games.map((game) => (
          <li onClick={() => onGameJoin(game.id)} key={game.id}>
            {JSON.stringify(game)}
          </li>
        ))}
      </ul>
      <button onClick={onCreateNewGame}>Create new game</button>
    </div>
  );
}

export default Main;
