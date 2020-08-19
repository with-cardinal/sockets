const Redis = require("ioredis");
const { subscribe, unsubscribe, send } = require(".");

const redis = new Redis("redis://localhost:6379");

(async () => {
  await subscribe(redis, "client-1", "channel-1");
  await send(redis, "channel-1", { msg: "hello world" });
  await unsubscribe(redis, "client-1", "channel-1");
  console.log("DONE");
  process.exit();
})();
