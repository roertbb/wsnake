import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initSocket } from "./ws";
import Game from "./containers/Game";
import Main from "./containers/Main";
import Lobby from "./containers/Lobby";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const socket = initSocket();

    // TODO: await proper socket initialization
    setTimeout(() => setLoading(false), 250);
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
