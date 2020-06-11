const getUrl = () =>
  process.env.NODE_ENV === "production"
    ? `wss://${window.location.host}/ws`
    : "ws://localhost:8080/ws";

let socket;

export function initSocket() {
  socket = new WebSocket(getUrl());
  socket.binaryType = "arraybuffer";

  socket.onmessage = (e) => {
    process.env.NODE_ENV === "development" && console.log("LOG [MSG]:", e.data);
  };

  socket.onerror = (error) => {
    console.error(`LOG [ERR]: ${JSON.stringify(error)}`);
  };

  return socket;
}

export function getSocket() {
  return socket;
}
