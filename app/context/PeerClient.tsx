import Peer from "peerjs";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export enum PeerState {
  OFFLINE,
  ONLINE,
}

export type PeerClientState =
  | {
      state: PeerState.OFFLINE;
    }
  | {
      state: PeerState.ONLINE;
      connection: Peer;
    };

const defaultState: PeerClientState = {
  state: PeerState.OFFLINE,
};

type PeerContextValue = {
  state: PeerClientState;
  connect: () => void;
};

const PeerContext = createContext<PeerContextValue>({
  state: defaultState,
  connect: () => {},
});

export const PeerClient: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PeerClientState>(defaultState);

  const connect = useCallback(() => {
    if (state.state == PeerState.OFFLINE) {
      const newPeer = new Peer();
      newPeer.on("open", () => {
        setState({
          state: PeerState.ONLINE,
          connection: newPeer,
        });
      });
      newPeer.on("close", () => {
        setState({
          state: PeerState.OFFLINE,
        });
      });
    }
  }, [state]);

  return (
    <PeerContext.Provider value={{ state, connect }}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeerClient = () => {
  return useContext(PeerContext);
};
