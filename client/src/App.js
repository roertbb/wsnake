import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initSocket } from "./ws";
import Game from "./containers/Game";
import Main from "./containers/Main";
import Lobby from "./containers/Lobby";
import { TOKEN, setSocket, requestToken } from "./ws/events";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const socket = initSocket();

    // TODO: await proper socket initialization
    setTimeout(() => {
      function messageHandler(msg) {
        const message = JSON.parse(msg.data);
        if (message.type === TOKEN) {
          localStorage.setItem("token", message.token);
        }
      }

      const token = localStorage.getItem("token");
      if (!token) {
        socket.send(requestToken());
      } else {
        socket.send(setSocket());
      }

      setLoading(false);

      socket.addEventListener("message", messageHandler);
      return () => {
        socket.removeEventListener("message", messageHandler);
      };
    }, 250);
  }, []);

  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
            <Route path="/" element={<Main />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
