import Redis from "ioredis";
import log from "./log";

const redisURL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(redisURL);
redis.subscribe("cardinal-socket-server");

// when redis receives a message on socket-broadcast
redis.on("message", async (channel, message) => {
  const splitAt = message.indexOf(":");
  if (splitAt === -1) {
    log({
      event: "invalidRedisMessage",
      message,
    });
    return;
  }

  const msgOp = message.slice(0, 1);
  const msgChannel = message.slice(1, splitAt);
  const msgString = message.slice(splitAt + 1);

  if (msgOp === "0") {
    log({ event: "subscribe", msgChannel, msgString });
    state.subscribe(msgChannel, msgString);
  } else if (msgOp === "1") {
    log({ event: "unsubscribe", msgChannel, msgString });
    state.unsubscribe(msgChannel, msgString);
  } else if (msgOp === "2") {
    log({ event: "send", msgChannel });
    state.send(msgChannel, msgString);
  } else if (msgOp === "3") {
    log({ event: "unsubscribeSubscribedTo", msgChannel, msgString });
    state.unsubscribeSubscribedTo(msgChannel, msgString);
  } else if (msgOp === "4") {
    log({ event: "disconnectSubscribedTo", msgChannel });
    state.disconnectSubscribedTo(msgChannel);
  }
});
