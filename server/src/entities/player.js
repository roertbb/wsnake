class Player {
  constructor(socket, token) {
    this.socket = socket;
    this.token = token;
    this.game = undefined;
    this.ready = false;
    this.color = undefined;
    this.direction = undefined;
    this.snake = [];
    this.alive = true;
  }

  static get directions() {
    return {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    };
  }

  handleInputUpdate(direction) {
    if (
      (direction === Player.directions.up &&
        this.direction !== Player.directions.down) ||
      (direction === Player.directions.left &&
        this.direction !== Player.directions.right) ||
      (direction === Player.directions.down &&
        this.direction !== Player.directions.up) ||
      (direction === Player.directions.right &&
        this.direction !== Player.directions.left)
    )
      this.direction = direction;
  }
}

module.exports = Player;
