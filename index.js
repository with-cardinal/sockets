async function subscribe(redis, clientId, channel) {
  await redis.publish("socket-broadcast", `0${channel}:${clientId}`);
}

async function unsubscribe(redis, clientId, channel) {
  await redis.publish("socket-broadcast", `1${channel}:${clientId}`);
}

async function send(redis, channel, msg) {
  const msgString = JSON.stringify(msg);
  await redis.publish("socket-broadcast", `2${channel}:${msgString}`);
}

module.exports = { subscribe, unsubscribe, send };
