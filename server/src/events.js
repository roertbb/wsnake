const { encode } = require("./helpers/message");

const events = {
  TOKEN: "token",
  SET_TOKEN: "setToken",
  CREATE_GAME: "createGame",
  JOIN_GAME: "joinGame",
  GAMES_UPDATE: "gamesUpdate",
  LOBBY_UPDATE: "lobbyUpdate",
  PLAYER_READY: "playerReady",
  GAME_UPDATE: "gameUpdate",
  USER_INPUT: "userInput",
};

exports.events = events;

exports.getGames = function (games) {
  return encode({ type: events.GAMES_UPDATE, games });
};

exports.getToken = function (token) {
  return encode({ type: events.TOKEN, token });
};

exports.lobbyUpdate = function (lobby) {
  return encode({ type: events.LOBBY_UPDATE, lobby });
};

exports.gameUpdate = function (gameState, score) {
  return encode({ type: events.GAME_UPDATE, gameState, score });
};
