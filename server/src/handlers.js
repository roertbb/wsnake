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
  if (player) {
    players.delete(player.socket);
    player.socket = socket;
    players.set(socket, player);
    if (player.game) {
      player.game.playerReconnected(player);
    } else {
      sendGamesData(socket);
    }
  } else {
    handleCreateToken(socket, message);
  }
}

function handleCreateGame(socket, message) {
  const id = uuid();
  games.set(id, new Game(id, () => deleteGame(id)));
  const gamesData = getGamesData();
  broadcastToLobby(getGames(gamesData));
}

function handleJoinGame(socket, message) {
  const { gameId } = message;
  const game = games.get(gameId);
  if (game.players.size < game.maxPlayers) {
    const player = players.get(socket);
    game.addPlayer(player);
    game.lobbyUpdate();
    const gamesData = getGamesData();
    broadcastToLobby(getGames(gamesData));
  }
}

function handlePlayerReady(socket, message) {
  const player = players.get(socket);
  player.ready = true;
  player.game.lobbyUpdate();
}

function handleUserInput(socket, message) {
  const player = players.get(socket);
  player.handleInputUpdate(message.direction);
}

// helpers
const getGamesData = () => Array.from(games.values(), Game.getGameInfo);

function sendGamesData(socket) {
  const gamesData = getGamesData();
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
  const gamesData = getGamesData();
  broadcastToLobby(getGames(gamesData));
}
