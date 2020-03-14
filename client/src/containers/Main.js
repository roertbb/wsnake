import React, { useReducer, useEffect } from "react";
import { getSocket } from "../ws";
import { createGame, getGames, GAMES, GAMES_UPDATED } from "../ws/events";

const Main = () => {
  const socket = getSocket();

  const [{ games, loading, isCreatingGame }, setState] = useReducer(
    (prevState, state) => ({ ...prevState, ...state }),
    {
      games: [],
      loading: true,
      isCreatingGame: false
    }
  );

  useEffect(() => {
    function messageHandler(msg) {
      const message = JSON.parse(msg.data);
      if (message.type === GAMES || message.type === GAMES_UPDATED) {
        updateGamesList(message);
      }
    }

    socket.send(getGames());
    socket.addEventListener("message", messageHandler);
    return () => {
      socket.removeEventListener("message", messageHandler);
    };
  }, [socket]);

  function createNewGame() {
    setState({ isCreatingGame: true });
    socket.send(createGame());
  }

  function updateGamesList({ games }) {
    setState({ games, loading: false, isCreatingGame: false });
  }

  if (loading) return <p>loading</p>;

  return (
    <div>
      <h1>wsnake</h1>
      <p>available games:</p>
      <ul>
        {games.map(game => (
          <li key={game.id}>{JSON.stringify(game)}</li>
        ))}
      </ul>
      <button disabled={isCreatingGame} onClick={createNewGame}>
        Create new game
      </button>
    </div>
  );
};

export default Main;
