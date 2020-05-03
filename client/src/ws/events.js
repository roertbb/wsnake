export const toBlob = (object) =>
  new Blob([JSON.stringify(object)], { type: "application/json" });

export const JOIN_GAME = "joinGame";
export const GAMES = "games";
export const CREATE_GAME = "createGame";
export const GAMES_UPDATED = "gamesUpdated";
export const TOKEN = "token";
export const SET_TOKEN = "setToken";
export const LOBBY_UPDATE = "lobbyUpdate";

export function getGames() {
  return toBlob({
    type: GAMES,
  });
}

export function createGame() {
  return toBlob({
    type: CREATE_GAME,
  });
}

export function joinGame(gameId) {
  return toBlob({
    type: JOIN_GAME,
    gameId,
  });
}

export function requestToken() {
  return toBlob({
    type: TOKEN,
  });
}

export function setSocket() {
  return toBlob({
    type: SET_TOKEN,
    token: localStorage.getItem("token"),
  });
}
