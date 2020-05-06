import React, { useEffect, useReducer } from "react";
import { initSocket } from "./ws";
import Game from "./containers/Game";
import Main from "./containers/Main";
import Lobby from "./containers/Lobby";
import {
  events,
  initToken,
  setToken,
  requestToken,
  joinGame,
  createGame,
  playerReady,
} from "./ws/events";

const socket = initSocket();

const states = {
  index: "INDEX",
  lobby: "LOBBY",
  game: "GAME",
};

const initialState = {
  state: states.index,
  loading: true,
  games: [],
  lobby: [],
  gameState: {},
};

const { TOKEN, GAMES_UPDATE, INIT_TOKEN, GAME_UPDATE, LOBBY_UPDATE } = events;

function reducer(state, action) {
  const msg = JSON.parse(action.data);

  if (msg.type === INIT_TOKEN) {
    if (!localStorage.getItem("token")) socket.send(requestToken());
    else socket.send(setToken(localStorage.getItem("token")));
  } else if (msg.type === TOKEN) {
    localStorage.setItem("token", msg.token);
    return state;
  } else if (msg.type === GAMES_UPDATE) {
    return { state: states.index, loading: false, games: msg.games };
  } else if (msg.type === LOBBY_UPDATE) {
    return { state: states.lobby, lobby: msg.lobby };
  } else if (msg.type === GAME_UPDATE) {
    return { state: states.game, gameState: msg.gameState };
  }

  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    const handler = (msg) => dispatch(msg);

    // TODO: await proper socket initialization
    setTimeout(() => {
      dispatch(initToken());

      socket.addEventListener("message", handler);
      return () => {
        socket.removeEventListener("message", handler);
      };
    }, 250);
  }, []);

  function onGameJoin(gameId) {
    socket.send(joinGame(gameId));
  }

  function onCreateNewGame() {
    socket.send(createGame());
  }

  function onPlayerReady() {
    socket.send(playerReady());
  }

  console.log({ state });

  if (state.loading) {
    return <p>loading...</p>;
  }

  if (state.state === states.index)
    return (
      <Main
        games={state.games}
        onGameJoin={onGameJoin}
        onCreateNewGame={onCreateNewGame}
      />
    );

  if (state.state === states.lobby) {
    return <Lobby lobby={state.lobby} onPlayerReady={onPlayerReady} />;
  }

  if (state.state === states.game) {
    return <Game gameState={state.gameState} socket={socket} />;
  }

  return <h1>oops</h1>;
}

export default App;
