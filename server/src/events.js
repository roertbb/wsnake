const { encode } = require("./helpers/message");

const events = {
  GAMES: "games",
  CREATE_GAME: "createGame",
  GAMES_UPDATED: "gamesUpdated",
  JOIN_GAME: "joinGame",
  TOKEN: "token",
  SET_TOKEN: "setToken",
};

exports.events = events;

exports.getGames = function (games) {
  return encode({ type: events.GAMES, games });
};

exports.getToken = function (token) {
  return encode({ type: events.TOKEN, token });
};

exports.joinedGame = function (game) {
  return encode({ type: events.JOIN_GAME, game });
};
