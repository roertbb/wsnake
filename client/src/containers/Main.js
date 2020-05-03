import React, { useReducer, useEffect } from "react";
import { getSocket } from "../ws";
import {
  createGame,
  getGames,
  joinGame,
  JOIN_GAME,
  GAMES,
  GAMES_UPDATED,
} from "../ws/events";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const socket = getSocket();
  const navigate = useNavigate();

  const [{ games, loading, isCreatingGame }, setState] = useReducer(
    (prevState, state) => ({ ...prevState, ...state }),
    {
      games: [],
      loading: true,
      isCreatingGame: false,
    }
  );

  useEffect(() => {
    function messageHandler(msg) {
      const message = JSON.parse(msg.data);
      if (message.type === GAMES || message.type === GAMES_UPDATED) {
        updateGamesList(message);
      } else if (message.type === JOIN_GAME) {
        navigate("/lobby");
      }
    }

    socket.send(getGames());
    socket.addEventListener("message", messageHandler);
    return () => {
      socket.removeEventListener("message", messageHandler);
    };
  }, [socket, navigate]);

  function createNewGame() {
    setState({ isCreatingGame: true });
    socket.send(createGame());
  }

  function updateGamesList({ games }) {
    setState({ games, loading: false, isCreatingGame: false });
  }

  function requestJoinGame(id) {
    socket.send(joinGame(id));
  }

  if (loading) return <p>loading</p>;

  return (
    <div>
      <h1>wsnake</h1>
      <p>available games:</p>
      <ul>
        {games.map((game) => (
          <li onClick={() => requestJoinGame(game.id)} key={game.id}>
            {JSON.stringify(game)}
          </li>
        ))}
      </ul>
      <button disabled={isCreatingGame} onClick={createNewGame}>
        Create new game
      </button>
    </div>
  );
};

export default Main;
