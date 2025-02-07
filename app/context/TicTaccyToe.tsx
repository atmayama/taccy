import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { PeerClient, PeerState, usePeerClient } from "./PeerClient";
import {
  SinglePeerConnectionManager,
  useSinglePeerConnectionManager,
} from "./SinglePeerConnectionManager";

const App = () => {
  const { connection, join } = useSinglePeerConnectionManager();
  const { state, connect } = usePeerClient();

  const [room, setRoom] = useState("");
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setRoom(event.target.value);
    },
    []
  );

  if (!connection) {
    return (
      <div className="h-screen w-screen flex flex-col gap-1 justify-center items-center ">
        Welcome to Tic Taccy Toe!
        {state.state === PeerState.ONLINE ? (
          <div className="flex flex-col gap-1 border p-3 rounded-md shadow-sm">
            <span className="flex flex-row justify-center items-center gap-2">
              Your ID : {state.connection.id.substring(0, 5)}...{" "}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(state.connection.id);
                }}
                className="material-symbols-outlined"
              >
                content_copy
              </button>
            </span>
            <div className="flex flex-col gap-2 border border-1 p-3">
              <input
                type="text"
                name="join-id"
                className="border border-spacing-3 border-black"
                onChange={handleChange}
                value={room}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative transition duration-300 ease-in-out"
                onClick={() => {
                  join(room);
                }}
              >
                Join
              </button>
            </div>
          </div>
        ) : (
          <button
            className="max-w-min bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative transition duration-300 ease-in-out"
            onClick={connect}
          >
            Connect
          </button>
        )}
      </div>
    );
  }
  return <Game />;
};

const Game = () => {
  const { connection } = useSinglePeerConnectionManager();
  const { state } = usePeerClient();
  const [me, setMe] = useState<number>();
  const [gstate, setgState] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [turn, setTurn] = useState(false);
  const [won, setWon] = useState<boolean>();

  useEffect(() => {
    if (connection) {
      connection.on("data", (data: unknown) => {
        const i = Number.parseInt(data as string);
        setgState((prev) => {
          const newState = [...prev];
          newState[i] = me === -1 ? 1 : -1;
          return newState;
        });
        setTurn(true);
        check();
      });
      start();
    }
  }, [connection, me]);

  const start = useCallback(() => {
    if (state.state == PeerState.ONLINE) {
      if (connection) {
        if (state.connection.id > connection.peer) {
          setMe(-1);
          setTurn(true);
        } else {
          setMe(1);
          setTurn(false);
        }
      }
    }
  }, []);
  const play = useCallback(
    (i: number) => {
      if (!turn) return;
      if (me == undefined || !connection) return;
      if (gstate[i] != 0) return;

      setgState((prev) => {
        const newState = [...prev];
        newState[i] = me;
        return newState;
      });
      connection.send(i.toString());
      setTurn(false);
      check();
    },
    [me, connection, turn, gstate]
  );

  const check = useCallback(() => {
    gstate;
  }, [gstate]);

  if (!connection) return "Game connection not available";
  if (me == undefined) {
    return "";
    // return (
    //   <div className="h-screen w-screen flex  flex-col justify-center items-center">
    //     <span>You are connected to : {connection.connectionId}</span>
    //     <button onClick={start}>START</button>
    //   </div>
    // );
  }
  if (won != undefined) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        {won ? "Congratulations!! You Won" : "Better luck next time"}
      </div>
    );
  }
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>{turn ? "Your Turn" : "Opponents Turn"}</div>
      <div
        className="grid grid-cols-3 grid-rows-3 gap-1"
        style={{ height: "min(50vh,50vw)", width: "min(50vh,50vw)" }}
      >
        {[0, 1, 2].map((x) => {
          return [0, 1, 2].map((y) => {
            const i = x * 3 + y;
            return (
              <div
                key={`${x}-${y}`}
                className="border border-black flex justify-center items-center"
                onClick={() => {
                  play(i);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
              >
                {gstate[i] == -1 && (
                  <span className="material-symbols-outlined">O</span>
                )}
                {gstate[i] == 1 && (
                  <span className="material-symbols-outlined">X</span>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
export const TicTaccyToe = () => {
  return (
    <PeerClient>
      <SinglePeerConnectionManager>
        <App />
      </SinglePeerConnectionManager>
    </PeerClient>
  );
};
