export const toBlob = (object) =>
  new Blob([JSON.stringify(object)], { type: "application/json" });

export const events = {
  TOKEN: "token",
  SET_TOKEN: "setToken",
  CREATE_GAME: "createGame",
  JOIN_GAME: "joinGame",
  GAMES_UPDATE: "gamesUpdate",
  INIT_TOKEN: "initToken",
  LOBBY_UPDATE: "lobbyUpdate",
  PLAYER_READY: "playerReady",
  GAME_UPDATE: "gameUpdate",
  USER_INPUT: "userInput",
};

export function initToken() {
  return { data: JSON.stringify({ type: events.INIT_TOKEN }) };
}

export function createGame() {
  return toBlob({
    type: events.CREATE_GAME,
  });
}

export function joinGame(gameId) {
  return toBlob({
    type: events.JOIN_GAME,
    gameId,
  });
}

export function requestToken() {
  return toBlob({
    type: events.TOKEN,
  });
}

export function setToken(token) {
  return toBlob({
    type: events.SET_TOKEN,
    token,
  });
}

export function playerReady() {
  return toBlob({
    type: events.PLAYER_READY,
  });
}

export function userInput(direction) {
  return toBlob({
    type: events.USER_INPUT,
    direction,
  });
}
