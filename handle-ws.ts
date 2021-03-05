import { isWebSocketCloseEvent, WebSocket } from "./deps.ts";

export default async function handleWs(sock: WebSocket): Promise<void> {
  console.log("socket connected");
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
