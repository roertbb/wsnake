const WebSocket = require("ws");
const { initHandlers } = require("./handlers");
const { decode } = require("./helpers/message");

const server = new WebSocket.Server({ port: 8080 });

const handlers = initHandlers();

server.on("connection", socket => {
  socket.on("message", message => {
    console.log(`LOG [MSG]: ${message}`);

    const data = decode(message);
    const { type } = data;

    handlers.get(type)(socket, data);
  });
});
