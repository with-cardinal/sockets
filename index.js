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

// Unsubscribe any clients who are subscribed to subscribedTo from channel
async function unsubscribeSubscribedTo(redis, subscribedTo, channel) {
  await redis.publish("socket-broadcast", `3${channel}:${subscribedTo}`);
}

// Disconnect any clients subscribed to a specific channel
async function disconnectSubscribedTo(redis, subscribedTo) {
  await redis.publish("socket-broadcast", `4${subscribedTo}:`);
}

module.exports = {
  subscribe,
  unsubscribe,
  unsubscribeSubscribedTo,
  disconnectSubscribedTo,
  send,
};
