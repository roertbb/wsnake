const websocket = require("ws");
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();
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

const port = process.env.NODE_PORT || 8080;
console.log("port", port);
server.listen(port);
