import uniq from "lodash/uniq";
import log from "./log";

export default class State {
  constructor() {
    this.clients = {};
    this.subs = {};
  }

  subscribe(channel, clientId) {
    // ignore unknown clients
    if (!this.clients[clientId]) {
      return;
    }

    this.clients[clientId].subs = uniq([
      ...this.clients[clientId].subs,
      channel,
    ]);
    this.subs[channel] = uniq([...(this.subs[channel] || []), clientId]);
  }

  unsubscribe(channel, clientId) {
    // ignore unknown clients
    if (!this.clients[clientId]) {
      return;
    }

    // ignore unknown channels
    if (!this.subs[channel]) {
      return;
    }

    this.clients[clientId].subs = this.clients[clientId].subs.filter(
      (sub) => sub !== channel
    );

    this.subs[channel] = this.subs[channel].filter((sub) => sub !== clientId);
  }

  unsubscribeSubscribedTo(channel, subscribedTo) {
    // ignore unknown subscribedTo
    if (!this.subs[subscribedTo]) {
      return;
    }

    // ignore unknown channel
    if (!this.subs[channel]) {
      return;
    }

    const checkClients = this.subs[subscribedTo];
    checkClients.forEach((clientId) => {
      if (this.clients[clientId]) {
        this.clients[clientId].subs = this.clients[clientId].subs.filter(
          (sub) => {
            if (sub === channel) {
              this.subs[channel] = this.subs[channel].filter(
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
  }

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

  connect(id, client, ip, timeout) {
    this.clients[id] = { client, ip, timeout, subs: [] };
  }

  removeClient(id) {
    if (!this.clients[id]) {
      return;
    }

    const clientSubs = this.clients[id].subs;
    Object.keys(this.subs).forEach((key) => {
      if (clientSubs.includes(key)) {
        this.subs[key] = this.subs[key].filter((id) => id !== id);
      }
    });

    delete this.clients[id];
  }

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
