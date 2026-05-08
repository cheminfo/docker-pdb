FROM node:24-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        pymol \
        graphicsmagick \
        rsync \
        gosu \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY config.json ./
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

VOLUME /app/data

RUN useradd --system --create-home --uid 10001 app \
    && mkdir -p /app/data \
    && chown -R app:app /app

# No USER directive: the entrypoint runs as root to fix bind-mount
# permissions, then drops privileges to `app` via gosu.
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "cron"]
