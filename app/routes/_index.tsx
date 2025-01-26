import type { MetaFunction } from "@remix-run/node";
import Peer, { DataConnection } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  const [active, setActive] = useState("");
  const [connected, setConnected] = useState(false);
  const peer = useRef<Peer>();
  const [connections, setConnections] = useState<
    Record<string, DataConnection | null>
  >({});
  const [messages, setMessages] = useState<string[]>([]);

  const [id, setId] = useState("");

  const onData = useCallback((data: unknown) => {
    setMessages((message) => [...message, JSON.stringify(data)]);
  }, []);

  const onOpen = useCallback((id: string) => {
    setActive(id);
  }, []);
  const onClose = useCallback(() => {
    setActive("");
  }, []);
  const connectToClient = useCallback(() => {
    console.log(`:${id}`);
    const con = peer.current?.connect(id);
    console.log(con);
    con?.on("open", () => {
      console.log(con.connectionId);
      onNewConnection(con);
    });
  }, [id]);
  const onNewConnection = useCallback((connection: DataConnection) => {
    connection.on("data", onData);
    setConnections((connections) => ({
      ...connections,
      [connection.connectionId]: connection,
    }));
    setConnected(true);
  }, []);

  const onCloseConnection = useCallback((id: string) => {
    setConnections({ ...connections, [id]: null });
    if (Object.values(connections).length == 0) {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    peer.current = new Peer();
    peer.current.on("open", onOpen);
    peer.current.on("close", onClose);
    peer.current.on("connection", onNewConnection);
    peer.current.on("disconnected", onCloseConnection);
    return () => {
      peer.current?.removeAllListeners();
      peer.current?.destroy();
    };
  }, []);

  const [message, setMessage] = useState("");

  const onSendMessage = useCallback(() => {
    Object.values(connections).forEach((con) => con?.send(message));
  }, [message]);

  if (!active) return "Not Active yet";
  return (
    <div className="flex h-screen items-center justify-center">
      {connected ? (
        <>
          <ul>
            {Object.values(connections)?.map((con) =>
              con ? (
                <li key={con.connectionId}>
                  {con.connectionId} for {con.peer}
                </li>
              ) : null
            )}
          </ul>
          <input
            type="text"
            name="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button onClick={onSendMessage}>SEND</button>
          <ul>
            {messages.map((msg, ind) => (
              <li key={ind}>{msg}</li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col gap-6 justify-center items-center">
          id: {active}
          <button
            onClick={() => {
              navigator.clipboard.writeText(active);
            }}
          >
            COPY
          </button>
          <input
            type="text"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <button onClick={connectToClient}>CONNECT</button>
        </div>
      )}
    </div>
  );
}
