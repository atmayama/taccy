import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PeerState, usePeerClient } from "./PeerClient";
import { DataConnection } from "peerjs";

const ConnectionContext = createContext<{
  connection: DataConnection | undefined;
  join: (id: string) => void;
}>({ connection: undefined, join: () => {} });

export const SinglePeerConnectionManager: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { state } = usePeerClient();
  const [conn, setConn] = useState<DataConnection>();
  useEffect(() => {
    if (state.state == PeerState.ONLINE) {
      state.connection.on("connection", (connection) => {
        setConn(connection);
      });
    } else {
      setConn(undefined);
    }
    return () => {};
  }, [state]);

  const join = useCallback(
    (id: string) => {
      if (state.state == PeerState.ONLINE) {
        const connection = state.connection.connect(id);
        setConn(connection);
      }
    },
    [state]
  );
  return (
    <ConnectionContext.Provider value={{ connection: conn, join }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useSinglePeerConnectionManager = () => {
  return useContext(ConnectionContext);
};
