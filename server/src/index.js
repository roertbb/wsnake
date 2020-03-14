const WebSocket = require("ws");
const { uuid } = require("uuidv4");

const server = new WebSocket.Server({ port: 8080 });

const players = [];
const games = [];

server.on("connection", socket => {
  socket.on("message", message => {
    console.log(`LOG [MSG]: ${message}`);

    const data = JSON.parse(message);
    const { type } = data;

    const handlers = {};
    handlers[GAMES] = handleGetGames;
    handlers[CREATE_GAME] = handleCreateGame;

    handlers[type](socket, message);
  });
});

const GAMES = "games";
const CREATE_GAME = "createGame";
const GAMES_UPDATED = "gamesUpdated";

function handleGetGames(socket, message) {
  socket.send(JSON.stringify({ type: GAMES, games }));
}

function handleCreateGame(socket, message) {
  const id = uuid();
  games.push({ id, players: {} });

  socket.send(JSON.stringify({ type: GAMES_UPDATED, games }));
  // broadcast to all players from main
}

// events
// handlers
// Repo? - players, game?
