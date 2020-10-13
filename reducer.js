const state = require("./state");

const SUBSCRIBE = Symbol("SUBSCRIBE");
const UNSUBSCRIBE = Symbol("UNSUBSCRIBE");
const UNSUBSCRIBE_SUBSCRIBED_TO = Symbol("UNSUBSCRIBE_SUBSCRIBED_TO");
const CONNECT = Symbol("CONNECT");

function reducer(prev, action, payload) {
  switch (action) {
    case SUBSCRIBE:
      break;
    case UNSUBSCRIBE:
      break;
    case UNSUBSCRIBE_SUBSCRIBED_TO:
      break;
    case CONNECT:
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [payload.id]: {
            client: payload.client,
            ip: payload.ip,
            timeout: payload.timeout,
            subs: [],
          },
        },
      };
      break;
    default:
      return prev;
  }
}

function init() {
  return { clients: {}, subs: {} };
}

module.exports = {
  init,
  reducer,
  SUBSCRIBE,
  UNSUBSCRIBE,
  UNSUBSCRIBE_SUBSCRIBED_TO,
  CONNECT,
};
