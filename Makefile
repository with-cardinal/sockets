SHELL := /bin/bash

.PHONY: run
run:
	REDIS_URL=redis://localhost:6379 \
	deno run --allow-net --allow-env sockets.ts
