import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const config = JSON.parse(
  readFileSync(join(import.meta.dirname, '../config.json'), 'utf8'),
);

let fullConfig = null;

/**
 * Load the runtime configuration: rsync destinations, PyMol render sizes,
 * and the on-disk PyMol output directory. The CouchDB section was removed
 * when the project switched to sqlite-only.
 *
 * `DATA_DIR` overrides every absolute path under `data/` so the same image
 * can run with `data/` mounted at any location.
 * @returns {object} Resolved configuration.
 */
export default function getConfig() {
  if (fullConfig) return fullConfig;

  let dataDir = '/app/data';
  if (process.env.DATA_DIR) {
    dataDir = process.env.DATA_DIR.replace(/\/$/, '');
  }

  config.dataDir = dataDir;
  config.asymetrical.rsync.destination = `${dataDir}/pdb`;
  config.asymetrical.rsync.historyDir = `${dataDir}/logs/pdb`;
  config.bioAssembly.rsync.destination = `${dataDir}/pdb-assembly`;
  config.bioAssembly.rsync.historyDir = `${dataDir}/logs/bioAssembly`;
  config.pymolDir = `${dataDir}/pymol`;

  if (config.asymetrical.rsync?.destination) {
    config.asymetrical.rsync.destination = `${config.asymetrical.rsync.destination.replace(/\/$/, '')}/`;
  }
  if (config.bioAssembly.rsync?.destination) {
    config.bioAssembly.rsync.destination = `${config.bioAssembly.rsync.destination.replace(/\/$/, '')}/`;
  }

  fullConfig = config;
  return fullConfig;
}
