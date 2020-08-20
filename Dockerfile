FROM node:lts-alpine

RUN addgroup -S sockets && adduser -S sockets -G sockets && \
  mkdir -p /srv/sockets && \
  chown sockets:sockets /srv/sockets

USER sockets

RUN npm install -g sockets

CMD ["sockets"]
