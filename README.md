# sockets

A socket server focused on simplicity.

## Configuration

The server supports the following configuration options, though environment
variables:

- `PORT`: The port that the socket server should listen on. Defaults to `3002`.
- `REDIS_URL`: The redis connection string to use. Defaults to `redis://localhost:6379`
- `CHECK_INTERVAL`: The interval at which to check for subscriptions, in milliseconds. Defaults to `10000`.
