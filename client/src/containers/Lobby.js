import React, { useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { getSocket } from "../ws";

const Lobby = () => {
  const socket = getSocket();
  const history = useHistory();

  const { maxPlayers, players } =
    history.location && history.location.state && history.location.state.lobby;

  const [{ lobbyPlayers }, setState] = useReducer(
    (prevState, state) => ({ ...prevState, ...state }),
    {
      lobbyPlayers: players && [],
    }
  );

  // const [lobbyPlayers, setLobbyPlayers] = useState(players && []);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div>
      <h1>wsnake - lobby</h1>
      <p>players:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{JSON.stringify(player)}</li>
        ))}
      </ul>
      {/* <button disabled={isCreatingGame} onClick={createNewGame}>
        Create new game
      </button> */}
    </div>
  );
};

export default Lobby;
