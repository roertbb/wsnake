let socket;
const url = "ws://localhost:8080";

export function initSocket() {
  socket = new WebSocket(url);

  socket.onmessage = (e) => {
    console.log("LOG [MSG]:", e.data);
  };

  socket.onerror = (error) => {
    console.error(`LOG [ERR]: ${JSON.stringify(error)}`);
  };

  return socket;
}

export function getSocket() {
  return socket;
}
