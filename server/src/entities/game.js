const Player = require("./player");
const { lobbyUpdate, gameUpdate } = require("../events");

const availableColors = {
  green: "green",
  red: "red",
  blue: "blue",
  orange: "orange",
};

const color2Code = {
  green: 1,
  red: 2,
  blue: 3,
  orange: 4,
};

const startPosition = [
  {
    snake: [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ],
    direction: Player.direction.right,
  },
  {
    snake: [
      { x: 2, y: 10 },
      { x: 1, y: 10 },
      { x: 0, y: 10 },
    ],
    direction: Player.direction.right,
  },
];

class Game {
  constructor(id) {
    this.id = id;
    this.players = new Map();
    this.maxPlayers = 2;
    this.boardSize = 20;
    this.colors = Object.keys(availableColors);
    this.board = undefined;
    this.intervalRef = undefined;
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
  }

  gameStarted() {
    const pos = [...startPosition];
    Array.from(this.players.values()).forEach((player) => {
      const { snake, direction } = pos.shift();
      player.snake = snake;
      player.direction = direction;
    });
    // init food position
    // set interval to update game state and broadcast update to others
    this.intervalRef = setInterval(() => this.update(), 100);
    // send whole board game update
  }

  update() {
    const board = Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill(0));

    // update player position
    Array.from(this.players.values()).forEach((player) => {
      const head = player.snake[0];
      // TODO: add direction to tail based on pre-last segment
      const tail = player.snake.pop();

      const newHead = {};
      if (player.direction === Player.direction.up) {
        newHead.x = head.x;
        newHead.y = (head.y - 1 + this.boardSize) % this.boardSize;
      } else if (player.direction === Player.direction.down) {
        newHead.x = head.x;
        newHead.y = (head.y + 1) % this.boardSize;
      } else if (player.direction === Player.direction.right) {
        newHead.x = (head.x + 1) % this.boardSize;
        newHead.y = head.y;
      } else if (player.direction === Player.direction.left) {
        newHead.x = (head.x - 1 + this.boardSize) % this.boardSize;
        newHead.y = head.y;
      }

      player.snake.unshift(newHead);

      // check new head collision with walls
      // check new head collision with fruits

      player.snake.forEach((segment) => {
        board[segment.y][segment.x] = color2Code[player.color];
      });
    });

    this.board = board;

    this.broadcastGameUpdate();
  }

  broadcastLobbyUpdate() {
    const allPlayersReady = Array.from(this.players.values()).every(
      (player) => player.ready
    );

    if (allPlayersReady) {
      this.gameStarted();
    } else {
      const msg = lobbyUpdate(Game.getLobbyInfo(this));
      Array.from(this.players.values()).forEach((player) => {
        player.socket.send(msg);
      });
    }
  }

  broadcastGameUpdate() {
    const boardState = this.board.map((line) => line.join("")).join("\n");

    Array.from(this.players.values()).forEach((player) => {
      const msg = gameUpdate(boardState);
      player.socket.send(msg);
    });
  }
}

module.exports = Game;
