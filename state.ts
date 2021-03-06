interface Client {
  close(code?: number, reason?: string): void;
  send(data: string): void;
}

export default class State {
  clients: Record<string, Client>;

  constructor() {
    this.clients = {};
  }

  connect(id: string, client: Client) {
    this.clients[id] = client;
    client.send(JSON.stringify({ connect: id }));
  }
}
