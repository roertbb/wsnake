const { uuid } = require("uuidv4");
const { getToken, getGames, joinedGame, events } = require("./events");
const { GAMES, CREATE_GAME, JOIN_GAME, TOKEN, SET_TOKEN } = events;
const Player = require("./entities/player");
const Game = require("./entities/game");

const players = new Map();
const games = new Map();

exports.initHandlers = function () {
  const handlers = new Map();

  handlers.set(GAMES, handleGetGames);
  handlers.set(CREATE_GAME, handleCreateGame);
  handlers.set(JOIN_GAME, handleJoinGame);
  handlers.set(TOKEN, handleCreateToken);
  handlers.set(SET_TOKEN, handleSetSocket);

  return handlers;
};

function handleCreateToken(socket, message) {
  const token = uuid();
  players.set(socket, new Player(socket, token));
  socket.send(getToken(token));
}

function handleGetGames(socket, message) {
  const gamesData = Array.from(games.values(), Game.getGameInfo);
  socket.send(getGames(gamesData));
}

function handleCreateGame(socket, message) {
  const id = uuid();
  games.set(id, new Game(id));
  const gamesData = Array.from(games.values(), Game.getGameInfo);
  broadcastToLobby(getGames(gamesData));
}

function handleJoinGame(socket, message) {
  const { gameId } = message;
  const game = games.get(gameId);
  if (game.players.size < game.maxPlayers) {
    const player = players.get(socket);
    game.addPlayer(player);
    game.broadcastLobbyUpdate();
    const gamesData = Array.from(games.values(), Game.getGameInfo);
    broadcastToLobby(getGames(gamesData));
  }
}

function handleSetSocket(socket, message) {
  const { token } = message;
  const player = Array.from(players.values()).find(
    (player) => player.token === token
  );
  players.delete(player.socket);
  players.set(socket, { ...player, socket });
  if (player.game) {
    // TODO: send message - redirect to proper route depending on state
  }
}

// helpers
function broadcastToLobby(message) {
  Array.from(players.values()).forEach((player) => {
    if (!player.game) {
      player.socket.send(message);
    }
  });
}
