FROM node:24-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        pymol \
        graphicsmagick \
        rsync \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY config.json ./

VOLUME /app/data

RUN useradd --system --create-home --uid 1001 app \
    && mkdir -p /app/data \
    && chown -R app:app /app
USER app

CMD ["npm", "run", "cron"]
