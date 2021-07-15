# cardinal-sockets-server

A socket server focused on simplicity.

## Installing

```
npm install -g cardinal-sockets-server
```

## Starting the Server

The server doesn't take any command line arguments:

```
cardinal-sockets-server
```

## Configuration

The server supports the following configuration options, though environment
variables:

- `PORT`: The port that the socket server should listen on. Defaults to `3002`.
- `REDIS_URL`: The redis connection string to use. Defaults to `redis://localhost:6379`
- `CHECK_INTERVAL`: The interval in milliseconds that the socket server checks for inactive clients and disconnects them. Defaults to 10000.
- `SDK_TOKENS`: A comma delimited list of access tokens for SDK clients. Ensure these tokens are long enough to be practically impossible to guess.


## The SDK

The SDK allows servers to control what is sent and who can listen on sockets. All requests use a JSON body 

### POST /sdk/grant

Request a grant to access a socket. Returns a client ID.

Grant must be called before any other operations, since it provides the client ID needed for all other operations.

Request:

```
curl https://socket-server.example \
  --request POST \
  --header "Content-Type: application/json"
```

Response:

```
{ "clientID": "6Im7ep6bwkMubh9wojHcv" }
```

### POST /sdk/subscribe

Subscribe client identified by `clientID` to `channel`.

### POST /sdk/unsubscribe

Unsubscribe client identified by `clientID` from  `channel`.

### POST /sdk/send

Send message to channel.

### POST /sdk/unsubscribeSubscribedTo

Find all clients subscribed to `subscribedTo` and disconnect them from `channel`.

### POST /sdk/disconnectSubscribedTo

Find all clients subscribed to `subscribedTo` and disconnect them.

# The Client

Clients simply connect to a websocket on `/client/ws` with a parameter of `clientID`, returned from the `/sdk/grant` endpoint. Then as messages are sent through the server, they're relayed to the client through the websocket.

## License

cardinal-sockets-server is licensed under the MIT license. See LICENSE for more information.
