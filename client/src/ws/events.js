export const toBlob = object =>
  new Blob([JSON.stringify(object)], { type: "application/json" });

export const JOIN_GAME = "joinGame";
export const GAMES = "games";
export const CREATE_GAME = "createGame";
export const GAMES_UPDATED = "gamesUpdated";

export function getGames() {
  return toBlob({
    type: GAMES
  });
}

export function createGame() {
  return toBlob({
    type: CREATE_GAME
  });
}

export function joinGame() {
  return toBlob({
    type: JOIN_GAME
  });
}
