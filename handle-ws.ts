import { isWebSocketCloseEvent, WebSocket } from "./deps.ts";
import State from "./state.ts";

export default async function handleWs(
  clientId: string,
  sock: WebSocket,
  state: State,
): Promise<void> {
  state.connect(clientId, sock);

  try {
    for await (const ev of sock) {
      if (isWebSocketCloseEvent(ev)) {
        console.log("ws:close", ev.code, ev.reason);
      }
    }
  } catch (ex) {
    console.error(`failed to receive frame: ${ex}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}
