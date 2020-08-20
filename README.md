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

## License

Sockets is licensed under the MIT license. See LICENSE for more information.
