# sockets

A socket server focused on simplicity.

## Installing

```
npm install -g sockets
```

## Starting the Server

The server doesn't take any command line arguments:

```
sockets
```

## Configuration

The server supports the following configuration options, though environment
variables:

- `PORT`: The port that the socket server should listen on. Defaults to `3002`.
- `REDIS_URL`: The redis connection string to use. Defaults to `redis://localhost:6379`
- `CHECK_INTERVAL`: The interval at which to check for subscriptions, in milliseconds. Defaults to `10000`.

## Core Concepts

Sockets delegates as much as possible to other software to ensure that it stays
simple. The Sockets model is composed of Connections, Subscriptions, and
Messages.

Connections are managed each time a new client connects. Upon connection the
server sends a client id that can be used to subscribe and send messages.

Subscriptions determine what client receives what messages. They are identified
by a string per channel. When messages are sent they are delivered to specific
channels.

Messages are sent to channels. The server handles converting the channel to a
list of subscribed clients and then sends the message to each of those clients.

All communication between the service sending messages is done with Redis
pub/sub. It provides a convenient and relatively high performance protocol for
communication.

## Avoiding Unwanted Clients

Sockets implements two techniques for avoiding unwanted clients:

1. It closes connections upon receiving any messages over the websocket.
2. It closes any connections that do not have any subscriptions. This is checked
   every `CHECK_INTERVAL` milliseconds.

## Library Documentation

A simple library is included the NPM package. It includes simple functions
for communicating with the server. All functions take a valid `Redis` connection
from [ioredis](https://www.npmjs.com/package/ioredis).

- `subscribe(redis, clientId, channel)` - Subscribes `clientId` to `channel`.
- `unsubscribe(redis, clientId, channel)` - Unsubscribes `clientId` from `channel`.
- `send(redis, channel, msg)` - Send msg over `channel`. `msg` is serialized to json before sending.

## License

Sockets is licensed under the MIT license. See LICENSE for more information.
