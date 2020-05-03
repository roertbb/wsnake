class Player {
  constructor(socket, token) {
    this.socket = socket;
    this.token = token;
    this.game = undefined;
    this.ready = false;
    this.color = undefined;
  }
}

module.exports = Player;
