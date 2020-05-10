const websocket = require("ws");
const express = require("express");
const http = require("http");
const { initHandlers } = require("./handlers");
const { decode } = require("./helpers/message");

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

const ws = new websocket.Server({ server, path: "/ws" });
const handlers = initHandlers();

ws.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(`LOG [MSG]: ${message}`);

    const data = decode(message);
    const { type } = data;

    handlers.get(type)(socket, data);
  });
});

server.listen(8000);
