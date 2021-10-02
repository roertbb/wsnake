const Player = require("./player");
const { lobbyUpdate, gameUpdate } = require("../events");

const availableColors = ["green", "blue", "pink", "yellow", "cyan"];

const color2Code = {
  // red: 1, // fruit
  // white: 2, // wall
  green: 3,
  blue: 4,
  pink: 5,
  yellow: 6,
  cyan: 7,
};

const startPosition = [
  {
    snake: [
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    direction: Player.directions.right,
  },
  {
    snake: [
      { x: 18, y: 17 },
      { x: 18, y: 18 },
      { x: 17, y: 18 },
    ],
    direction: Player.directions.left,
  },
  {
    snake: [
      { x: 17, y: 1 },
      { x: 18, y: 1 },
      { x: 18, y: 2 },
    ],
    direction: Player.directions.down,
  },
  {
    snake: [
      { x: 1, y: 17 },
      { x: 1, y: 18 },
      { x: 2, y: 18 },
    ],
    direction: Player.directions.up,
  },
];

class Game {
  constructor(id, { onGameFinished, onGameStarted }) {
    this.id = id;
    this.players = new Map();
    this.previewer = null;
    this.inProgress = false;
    this.maxPlayers = 4;
    this.boardSize = 20;
    this.colors = availableColors;
    this.board = this.getEmptyBoard();
    this.updateInterval = undefined;
    this.endTimeout = undefined;
    this.walls = [];
    this.food = [];
    this.onGameFinished = onGameFinished;
    this.onGameStarted = onGameStarted;
  }

  static getGameInfo({ id, players, maxPlayers, inProgress }) {
    return {
      id,
      players: players.size,
      maxPlayers,
      inProgress,
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
    player.score = 0;
    player.ready = false;
    player.alive = true;
    player.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.colors = this.colors.filter((col) => col != player.color);
    this.players.set(player.token, player);
  }

  addPreviewer(previewer) {
    previewer.game = this;
    this.previewer = previewer;
    this.lobbyUpdate();
  }

  gameStarted() {
    this.inProgress = true;
    const pos = [...startPosition];
    Array.from(this.players.values()).forEach((player) => {
      const { snake, direction } = pos.shift();
      player.snake = [...snake];
      player.direction = direction;
      player.lastDirection = direction;
    });
    this.genInitialFood();
    this.updateInterval = setInterval(() => this.update(), 100);
  }

  genInitialFood() {
    const food = [];
    for (let i = 0; i < 5; i++) {
      let x = 1,
        y = 1;
      while (x === 1 || x === 18)
        x = Math.floor(Math.random() * this.boardSize);
      while (y === 1 || y === 18)
        y = Math.floor(Math.random() * this.boardSize);
      food.push({ x, y });
    }
    this.food = food;
  }

  genNewFood() {
    while (true) {
      const x = Math.floor(Math.random() * this.boardSize);
      const y = Math.floor(Math.random() * this.boardSize);

      if (this.board[y][x] === 0) {
        this.food.push({ x, y });
        return;
      }
    }
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
        player.lastDirection = player.direction;

        const prev = this.board[newHead.y][newHead.x];
        let fruitEaten = false;
        if (prev === 1) {
          // collision with food -> grow 1 segment and gen new food
          fruitEaten = true;
          player.score++;
          this.food = this.food.filter(
            ({ x, y }) => !(x === newHead.x && y === newHead.y)
          );
          this.genNewFood();
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
        if (player.alive) {
          player.snake.unshift(newHead);
          if (!fruitEaten) player.snake.pop();
        }

        player.snake.forEach((segment) => {
          board[segment.y][segment.x] = color2Code[player.color];
        });
      }
    });

    this.food.forEach(({ x, y }) => (board[y][x] = 1));
    this.walls.forEach(({ x, y }) => (board[y][x] = 2));

    this.board = board;

    this.broadcastGameUpdate();
  }

  lobbyUpdate() {
    const playersValues = Array.from(this.players.values());
    const allPlayersReady = playersValues.every((player) => player.ready);

    if (allPlayersReady && playersValues.length > 1) {
      this.gameStarted();
      this.onGameStarted();
    } else {
      this.broadcastLobbyUpdate();
    }
  }

  broadcastLobbyUpdate() {
    const msg = lobbyUpdate(Game.getLobbyInfo(this));
    Array.from(this.players.values()).forEach((player) => {
      player.socket.send(msg);
    });
    if (this.previewer) {
      this.previewer.socket.send(msg);
    }
  }

  broadcastGameUpdate() {
    const boardState = this.board.map((line) => line.join("")).join("\n");
    const score = Array.from(this.players.values(), Player.getScoreInfo);

    const allDies = Array.from(this.players.values()).every(
      (player) => !player.alive
    );
    if (allDies && !this.endTimeout) {
      clearInterval(this.updateInterval);
      this.endTimeout = setTimeout(() => this.closeGame(), 5000);
    }

    const msg = gameUpdate(boardState, score);
    Array.from(this.players.values()).forEach((player) => {
      player.socket.send(msg);
    });
    if (this.previewer) {
      this.previewer.socket.send(msg);
    }
  }

  closeGame() {
    Array.from(this.players.values()).forEach(
      (player) => (player.game = undefined)
    );
    if (this.previewer) {
      this.previewer.game = undefined;
    }
    this.onGameFinished();
  }

  playerReconnected(player) {
    this.players.set(player.token, player);
    const allPlayersReady = Array.from(this.players.values()).every(
      (player) => player.ready
    );

    if (allPlayersReady) {
      this.broadcastGameUpdate();
    } else {
      this.broadcastLobbyUpdate();
    }
  }
}

module.exports = Game;
