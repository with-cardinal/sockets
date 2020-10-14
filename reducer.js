const state = require("./state");
const uniq = require("lodash/uniq");

const SUBSCRIBE = Symbol("SUBSCRIBE");
const UNSUBSCRIBE = Symbol("UNSUBSCRIBE");
const UNSUBSCRIBE_SUBSCRIBED_TO = Symbol("UNSUBSCRIBE_SUBSCRIBED_TO");
const CONNECT = Symbol("CONNECT");
const REMOVE_CLIENT = Symbol("REMOVE_CLIENT");

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
            subs: uniq([
              ...prev.clients[payload.clientId].subs,
              payload.channel,
            ]),
          },
        },
        subs: {
          ...prev.subs,
          [payload.channel]: uniq([
            ...(prev.subs[payload.channel] || []),
            payload.clientId,
          ]),
        },
      };
      break;
    case UNSUBSCRIBE:
      // ignore unknown clients
      if (!prev.clients[payload.clientId]) {
        return prev;
      }

      // ignore unknown channels
      if (!prev.subs[payload.channel]) {
        return prev;
      }

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [payload.clientId]: {
            ...prev.clients[payload.clientId],
            subs: prev.clients[payload.clientId].subs.filter(
              (sub) => sub !== payload.channel
            ),
          },
        },
        subs: {
          ...prev.subs,
          [payload.channel]: prev.subs[payload.channel].filter(
            (sub) => sub !== payload.clientId
          ),
        },
      };
      break;
    case UNSUBSCRIBE_SUBSCRIBED_TO:
      // ignore unknown subscribedTo
      if (!prev.subs[payload.subscribedTo]) {
        return prev;
      }

      // ignore unknown channel
      if (!prev.subs[payload.channel]) {
        return prev;
      }

      const next = { ...prev };
      const checkClients = next.subs[payload.subscribedTo];

      checkClients.forEach((clientId) => {
        if (next.clients[clientId]) {
          next.clients[clientId].subs = next.clients[clientId].subs.filter(
            (sub) => {
              if (sub === payload.channel) {
                next.subs[payload.channel] = next.subs[payload.channel].filter(
                  (id) => id !== clientId
                );
                return false;
              } else {
                return true;
              }
            }
          );
        }
      });

      return next;
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
    case REMOVE_CLIENT:
      if (!prev.clients[payload.id]) {
        return prev;
      }

      const clientSubs = prev.clients[payload.id].subs;
      const newSubs = { ...prev.subs };
      Object.keys(prev.subs).forEach((key) => {
        if (clientSubs.includes(key)) {
          newSubs[key] = prev.subs[key].filter((id) => id !== payload.id);
        }
      });

      const newClients = { ...prev.clients };
      delete newClients[payload.id];

      return {
        ...prev,
        clients: newClients,
        subs: newSubs,
      };
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
  REMOVE_CLIENT,
};
