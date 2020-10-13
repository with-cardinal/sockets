const state = require("./state");
const uniq = require("lodash/uniq");

const SUBSCRIBE = Symbol("SUBSCRIBE");
const UNSUBSCRIBE = Symbol("UNSUBSCRIBE");
const UNSUBSCRIBE_SUBSCRIBED_TO = Symbol("UNSUBSCRIBE_SUBSCRIBED_TO");
const CONNECT = Symbol("CONNECT");

function reducer(prev, action, payload) {
  switch (action) {
    case SUBSCRIBE:
      // ignore unknown clients
      if (!prev.clients[payload.clientId]) {
        return prev;
      }

      return {
        clients: {
          ...prev.clients,
          [payload.clientId]: {
            ...prev.clients[payload.clientId],
            subs: uniq([...prev.clients[payload.clientId], channel]),
          },
        },
        subs: {
          ...prev.subs,
          [channel]: uniq([...(prev.subs[channel] || []), payload.clientId]),
        },
      };
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
