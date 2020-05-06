const { uuid } = require("uuidv4");
const { getToken, getGames, events } = require("./events");
const {
  CREATE_GAME,
  JOIN_GAME,
  TOKEN,
  SET_TOKEN,
  PLAYER_READY,
  USER_INPUT,
} = events;
const Player = require("./entities/player");
const Game = require("./entities/game");

const players = new Map();
const games = new Map();

exports.initHandlers = function () {
  const handlers = new Map();

  handlers.set(CREATE_GAME, handleCreateGame);
  handlers.set(JOIN_GAME, handleJoinGame);
  handlers.set(TOKEN, handleCreateToken);
  handlers.set(SET_TOKEN, handleSetSocket);
  handlers.set(PLAYER_READY, handlePlayerReady);
  handlers.set(PLAYER_READY, handlePlayerReady);
  handlers.set(USER_INPUT, handleUserInput);

  return handlers;
};

function handleCreateToken(socket, message) {
  const token = uuid();
  players.set(socket, new Player(socket, token));
  socket.send(getToken(token));
  sendGamesData(socket);
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
  } else {
    sendGamesData(socket);
  }
}

// function handleGetGames(socket, message) {
//   const gamesData = Array.from(games.values(), Game.getGameInfo);
//   socket.send(getGames(gamesData));
// }

function handleCreateGame(socket, message) {
  const id = uuid();
  games.set(id, new Game(id, () => deleteGame(id)));
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

function handlePlayerReady(socket, message) {
  const player = players.get(socket);
  player.ready = true;
  player.game.broadcastLobbyUpdate();
}

function handleUserInput(socket, message) {
  const player = players.get(socket);
  player.handleInputUpdate(message.direction);
}

// helpers
function sendGamesData(socket) {
  const gamesData = Array.from(games.values(), Game.getGameInfo);
  socket.send(getGames(gamesData));
}

function broadcastToLobby(message) {
  Array.from(players.values()).forEach((player) => {
    if (!player.game) {
      player.socket.send(message);
    }
  });
}

function deleteGame(id) {
  games.delete(id);
  const gamesData = Array.from(games.values(), Game.getGameInfo);
  broadcastToLobby(getGames(gamesData));
}
