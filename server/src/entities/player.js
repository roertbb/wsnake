class Player {
  constructor(socket, token) {
    this.socket = socket;
    this.token = token;
    this.game = undefined;
    this.ready = false;
    this.color = undefined;
    this.direction = undefined;
    this.lastDirection = undefined;
    this.snake = [];
    this.alive = true;
    this.score = 0;
  }

  static get directions() {
    return {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    };
  }

  static getScoreInfo({ color, score }) {
    return { color, score };
  }

  handleInputUpdate(direction) {
    if (
      (direction === Player.directions.up &&
        this.lastDirection !== Player.directions.down) ||
      (direction === Player.directions.left &&
        this.lastDirection !== Player.directions.right) ||
      (direction === Player.directions.down &&
        this.lastDirection !== Player.directions.up) ||
      (direction === Player.directions.right &&
        this.lastDirection !== Player.directions.left)
    )
      this.direction = direction;
  }
}

module.exports = Player;
