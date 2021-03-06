import { acceptWebSocket, redisConnect, redisParseURL, serve } from "./deps.ts";
import handleWs from "./handle-ws.ts";
import State from "./state.ts";

async function serverLoop(port: string, state: State) {
  for await (const req of serve(`:${port}`)) {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname === "/socket") {
      const clientId = url.searchParams.get("id");

      if (clientId === null) {
        await req.respond({ status: 404 });
        return;
      }

      const { conn, r: bufReader, w: bufWriter, headers } = req;
      acceptWebSocket({ conn, bufReader, bufWriter, headers }).then((sock) =>
        handleWs(clientId, sock, state)
      )
        .catch(
          async (e) => {
            console.error(`failed to accept websocket: ${e}`);
            await req.respond({ status: 400 });
          },
        );
    } else {
      await req.respond({ status: 404 });
    }
  }
}

const port = Deno.env.get("PORT") || "3002";
const redisUrl = Deno.env.get("REDIS_URL") || "";
const checkInterval = Number(Deno.env.get("CHECK_INTERVAL")) || 10000;

let redis;
try {
  redis = await redisConnect(redisParseURL(redisUrl));
} catch (ex) {
  console.error("Redis connect error:\n", ex);
  Deno.exit(1);
}

const state = new State();

console.log(`Listening on ${port}`);
serverLoop(port, state);
