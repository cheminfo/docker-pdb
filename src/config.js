import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const config = JSON.parse(
  readFileSync(join(import.meta.dirname, '../config.json'), 'utf8'),
);

let fullConfig = null;

export default function getConfig() {
  if (fullConfig) return fullConfig;

  if (process.env.COUCHDB_ADMIN_PASSWORD) {
    config.couch.password = process.env.COUCHDB_ADMIN_PASSWORD;
  }

  const couchUrl = new URL(config.couch.url);
  if (!couchUrl.username && config.couch.user && config.couch.password) {
    couchUrl.username = config.couch.user;
    couchUrl.password = config.couch.password;
  }
  if (!couchUrl.port && config.couch.port) {
    couchUrl.port = String(config.couch.port);
  }
  config.couch.fullUrl = couchUrl.toString();

  if (config.asymetrical.rsync?.destination) {
    config.asymetrical.rsync.destination = `${config.asymetrical.rsync.destination.replace(/\/$/, '')}/`;
  }
  if (config.bioAssembly.rsync?.destination) {
    config.bioAssembly.rsync.destination = `${config.bioAssembly.rsync.destination.replace(/\/$/, '')}/`;
  }

  fullConfig = config;
  return fullConfig;
}
