class Player {
  constructor(socket, token) {
    this.socket = socket;
    this.token = token;
    this.game = undefined;
  }
}

module.exports = Player;
