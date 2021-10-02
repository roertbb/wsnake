import React, { useEffect, useReducer } from "react";
import { initSocket } from "./ws";
import Game from "./containers/Game";
import Main from "./containers/Main";
import Lobby from "./containers/Lobby";
import PreviewerLobby from "./containers/PreviewerLobby";
import ScanGameCode from "./containers/ScanGameCode";
import {
  events,
  initToken,
  initJoiner,
  requestTokenAndJoin,
  setTokenAndJoin,
  setToken,
  requestToken,
  joinGame,
  createGame,
  playerReady,
} from "./ws/events";
import "./App.scss";
import { decode } from "./ws/message";
import MobileNavigation from "./containers/MobileNavigation";

const socket = initSocket();

const states = {
  index: "INDEX",
  lobby: "LOBBY",
  game: "GAME",
};

const initialState = (previewer) => ({
  state: states.index,
  loading: true,
  games: [],
  lobby: [],
  gameState: {},
  previewer,
});

const {
  TOKEN,
  GAMES_UPDATE,
  INIT_TOKEN,
  GAME_UPDATE,
  LOBBY_UPDATE,
  INIT_JOINER,
} = events;

const previewerPath = "/previewer";
const joinerPath = "/join";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function previewerReducer(state, action) {
  const msg = decode(action.data);

  const firstInit = state.state === states.index;
  const gameFinished = state.state === states.game && msg.type === GAMES_UPDATE;

  if ((firstInit || gameFinished) && !state.gameInitialised) {
    socket.send(createGame({ previewer: true }));
    return { ...state, loading: true, gameInitialised: true, previewer: true };
  }

  const commonState = {
    loading: false,
    gameInitialised: false,
    previewer: true,
  };

  if (msg.type === LOBBY_UPDATE) {
    return {
      ...commonState,
      state: states.lobby,
      lobby: msg.lobby,
    };
  } else if (msg.type === GAME_UPDATE) {
    return {
      ...commonState,
      state: states.game,
      gameState: msg.gameState,
      score: msg.score,
    };
  }
}

function reducer(state, action) {
  const msg = decode(action.data);

  if (state.previewer) return previewerReducer(state, action);

  const token = localStorage.getItem("token");

  if (msg.type === INIT_TOKEN) {
    if (!token) socket.send(requestToken());
    else socket.send(setToken(token));
  } else if (msg.type === INIT_JOINER) {
    if (!token) socket.send(requestTokenAndJoin(msg.gameId));
    else socket.send(setTokenAndJoin(token, msg.gameId));
  } else if (msg.type === TOKEN) {
    localStorage.setItem("token", msg.token);
    return state;
  } else if (msg.type === GAMES_UPDATE) {
    return { state: states.index, loading: false, games: msg.games };
  } else if (msg.type === LOBBY_UPDATE) {
    return { state: states.lobby, lobby: msg.lobby };
  } else if (msg.type === GAME_UPDATE) {
    return { state: states.game, gameState: msg.gameState, score: msg.score };
  }

  return state;
}

function App() {
  const { pathname, search } = window.location;

  const previewer = pathname === previewerPath;
  const joiner = pathname && pathname.startsWith(joinerPath);
  const [state, dispatch] = useReducer(reducer, initialState(previewer));

  useEffect(
    function () {
      const handler = (msg) => dispatch(msg);

      socket.onopen = () => {
        if (joiner) {
          const gameId = search.replace("?id=", "");

          if (gameId !== "") {
            dispatch(initJoiner(gameId));
          }
        } else {
          dispatch(initToken());
        }
      };

      socket.addEventListener("message", handler);
      return () => {
        socket.removeEventListener("message", handler);
      };
    },
    [joiner, search]
  );

  function onGameJoin(gameId) {
    socket.send(joinGame(gameId));
  }

  function onCreateNewGame() {
    socket.send(createGame());
  }

  function onPlayerReady() {
    socket.send(playerReady());
  }

  if (state.loading) {
    return <p>loading...</p>;
  }

  if (state.state === states.index) {
    if (joiner) {
      return <ScanGameCode />;
    }

    return (
      <Main
        games={state.games}
        onGameJoin={onGameJoin}
        onCreateNewGame={onCreateNewGame}
      />
    );
  }

  if (state.state === states.lobby) {
    if (previewer) {
      return <PreviewerLobby lobby={state.lobby} gameId={state.lobby.id} />;
    }

    return <Lobby lobby={state.lobby} onPlayerReady={onPlayerReady} />;
  }

  if (state.state === states.game) {
    if (isMobile && joiner) {
      return <MobileNavigation socket={socket} />;
    }

    return (
      <Game
        gameState={state.gameState}
        score={state.score}
        socket={socket}
        previewer={previewer}
      />
    );
  }

  return <h1>oops</h1>;
}

export default App;
