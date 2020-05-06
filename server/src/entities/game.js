const Player = require("./player");
const { lobbyUpdate, gameUpdate } = require("../events");

const availableColors = {
  green: "green",
  red: "red",
  blue: "blue",
  orange: "orange",
};

const color2Code = {
  // fruit: 1,
  // wall: 2,
  green: 3,
  red: 4,
  blue: 5,
  orange: 6,
};

const startPosition = [
  {
    snake: [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ],
    direction: Player.directions.right,
  },
  {
    snake: [
      { x: 2, y: 10 },
      { x: 1, y: 10 },
      { x: 0, y: 10 },
    ],
    direction: Player.directions.right,
  },
  {
    snake: [
      { x: 2, y: 15 },
      { x: 1, y: 15 },
      { x: 0, y: 15 },
    ],
    direction: Player.directions.right,
  },
];

class Game {
  constructor(id) {
    this.id = id;
    this.players = new Map();
    this.maxPlayers = 3;
    this.boardSize = 20;
    this.colors = Object.keys(availableColors);
    this.board = this.getEmptyBoard();
    this.intervalRef = undefined;
    this.walls = [];
    this.food = [];
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
      player.snake = [...snake];
      player.direction = direction;
    });
    // init food position
    this.intervalRef = setInterval(() => this.update(), 100);
  }

  getEmptyBoard() {
    return Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill(0));
  }

  update() {
    const board = this.getEmptyBoard();

    // update player position
    Array.from(this.players.values()).forEach((player) => {
      if (player.alive) {
        const head = player.snake[0];

        const newHead = {};
        if (player.direction === Player.directions.up) {
          newHead.x = head.x;
          newHead.y = (head.y - 1 + this.boardSize) % this.boardSize;
        } else if (player.direction === Player.directions.down) {
          newHead.x = head.x;
          newHead.y = (head.y + 1) % this.boardSize;
        } else if (player.direction === Player.directions.right) {
          newHead.x = (head.x + 1) % this.boardSize;
          newHead.y = head.y;
        } else if (player.direction === Player.directions.left) {
          newHead.x = (head.x - 1 + this.boardSize) % this.boardSize;
          newHead.y = head.y;
        }

        const prev = this.board[newHead.y][newHead.x];
        if (prev === 1) {
          // eat fruit
        } else if (prev !== 0) {
          // collision with wall or some other player -> snake dies
          player.alive = false;
          this.walls = [...this.walls, ...player.snake];
        }

        // my head has the same position as someone else head -> both snakes dies
        Array.from(this.players.values()).forEach((enemy) => {
          if (enemy !== player) {
            const enemyHead = enemy.snake[0];
            if (enemyHead.x === newHead.x && enemyHead.y === newHead.y) {
              enemy.alive = false;
              player.alive = false;
              this.walls = [...this.walls, ...player.snake, ...enemy.snake];
            }
          }
        });

        // advance snake
        player.snake.unshift(newHead);
        player.snake.pop();

        player.snake.forEach((segment) => {
          board[segment.y][segment.x] = color2Code[player.color];
        });
      }
    });

    this.walls.forEach((wall) => {
      board[wall.y][wall.x] = 2;
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
