FROM node:24-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        pymol \
        graphicsmagick \
        rsync \
        gosu \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Workspace metadata first so the install layer is cached.
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm ci --omit=dev --workspace=backend && npm cache clean --force

COPY backend ./backend
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
