class Player {
  constructor(socket, token) {
    this.socket = socket;
    this.token = token;
    this.game = undefined;
    this.ready = false;
    this.color = undefined;
    this.snake = [];
  }

  static get direction() {
    return {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    };
  }

  handleInputUpdate(direction) {
    this.direction = direction;
  }
}

module.exports = Player;
