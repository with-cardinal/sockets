// really simple state management
function state(init, reducer) {
  let internalState = init;

  return (action, payload) => {
    internalState = reducer(internalState, action, payload);
    return internalState;
  };
}

module.exports = state;

export default class State {
  constructor() {
    this.clients = {};
    this.subs = {};
  }

  subscribe(channel, clientId) { }

  unsubscribe(channel, clientId) { }

  unsubscribeSubscribedTo(channel, subscribedTo) { }

  disconnectSubscribedTo(subscribedTo) {
    const clientIds = this.subs[subscribedTo];

    if (clientIds) {
      clientIds.forEach((clientId) => {
        if (this.clients[clientId] && this.clients[clientId].connection) {
          this.clients[clientId].connection.close();
        }
      });
    }
  }

  connect(id, client, ip, timeout) { }

  removeClient(id) { }

  disconnectAll() {
    Object.values(this.clients).forEach(({ client }) => {
      client.close();
    });
  }

  send(channel, msgString) {
    const clientIds = this.subs[channel];

    if (clientIds) {
      clientIds.forEach((clientId) => {
        if (this.clients[clientId]) {
          this.clients[clientId].client.send(msgString);
        } else {
          this.unsubscribe(channel, clientId);
        }
      });
    }
  }

  checkSubs(clientId) {
    if (this.clients[clientId] && this.clients[clientId].subs.length === 0) {
      log({ event: "noSubs", clientId });
      this.clients[clientId].client.terminate();
    }
  }
}
