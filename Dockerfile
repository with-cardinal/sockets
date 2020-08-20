FROM node:lts-alpine

RUN addgroup -S sockets && adduser -S sockets -G sockets && \
  mkdir -p /srv/sockets && \
  chown sockets:sockets /srv/sockets

RUN npm install -g @with-cardinal/sockets

USER sockets

CMD ["sockets"]
