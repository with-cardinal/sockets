import { acceptWebSocket, serve } from "./deps.ts";
import { handleWs } from "./handle-ws.ts";

const port = Deno.env.get("PORT") || "3002";

for await (const req of serve(`:${port}`)) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  acceptWebSocket({ conn, bufReader, bufWriter, headers }).then(handleWs).catch(
    async (e) => {
      console.error(`failed to accept websocket: ${e}`);
      await req.response({ status: 400 });
    },
  );
}

console.log("Started on ");
