import { encode } from "./message";

export const events = {
  TOKEN: "token",
  SET_TOKEN: "setToken",
  CREATE_GAME: "createGame",
  JOIN_GAME: "joinGame",
  GAMES_UPDATE: "gamesUpdate",
  LOBBY_UPDATE: "lobbyUpdate",
  PLAYER_READY: "playerReady",
  GAME_UPDATE: "gameUpdate",
  USER_INPUT: "userInput",
  INIT_TOKEN: "initToken",
};

export function initToken() {
  return { data: encode({ type: events.INIT_TOKEN }) };
}

export function createGame() {
  return encode({
    type: events.CREATE_GAME,
  });
}

export function joinGame(gameId) {
  return encode({
    type: events.JOIN_GAME,
    gameId,
  });
}

export function requestToken() {
  return encode({
    type: events.TOKEN,
  });
}

export function setToken(token) {
  return encode({
    type: events.SET_TOKEN,
    token,
  });
}

export function playerReady() {
  return encode({
    type: events.PLAYER_READY,
  });
}

export function userInput(direction) {
  return encode({
    type: events.USER_INPUT,
    direction,
  });
}
