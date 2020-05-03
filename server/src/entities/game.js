const { joinedGame, lobbyUpdate } = require("../events");

const availableColors = {
  green: "green",
  red: "red",
  blue: "blue",
  orange: "orange",
};

class Game {
  constructor(id) {
    this.id = id;
    this.players = new Map();
    this.maxPlayers = 2;
    this.colors = Object.keys(availableColors);
  }

  static getGameInfo({ id, players, maxPlayers }) {
    return {
      id,
      players: players.size,
      maxPlayers,
    };
  }

  static getLobbyInfo({ id, players, maxPlayers }) {
    return {
      id,
      players: Array.from(players.values()).map(({ token, ready, color }) => ({
        id: token,
        ready,
        color,
      })),
      maxPlayers,
    };
  }

  addPlayer(player) {
    player.game = this;
    player.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.colors = this.colors.filter((col) => col != player.color);
    this.players.set(player.token, player);
    player.socket.send(joinedGame(Game.getLobbyInfo(this)));
  }

  broadcastLobbyUpdate() {
    const msg = lobbyUpdate(Game.getLobbyInfo(this));
    Array.from(this.players.values()).forEach((player) => {
      player.socket.send(msg);
    });
  }
}

module.exports = Game;
