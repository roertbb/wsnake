class Game {
  constructor(id) {
    this.id = id;
    this.players = new Map();
    this.maxPlayers = 2;
  }

  static parseInfo(game) {
    return { ...game, players: game.players.size };
  }

  broadcastLobbyData() {
    console.log("broadcast game lobby data");
    // Array.from(this.players).forEach((player) => {
    //   player.socket.send(message);
    // });
  }
}

module.exports = Game;
