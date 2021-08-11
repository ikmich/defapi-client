import { ApiManifest, DefapiSource, ManifestMap } from '../index';
import { FS, Path } from './deps';
import chalk from 'chalk';

export const PKG_NAME = 'defapi-client';
export const SOURCES_FILENAME = 'defapi.sources.js';
export const CLIENT_DIR = Path.join(__dirname, '../client/dist');
export const MANIFESTS_DIR = Path.join(CLIENT_DIR, 'manifests/');
export const SOURCES_DIR = Path.join(__dirname, '../');
export const SOURCES_FILE = Path.join(SOURCES_DIR, SOURCES_FILENAME);
export const MANIFEST_ROUTE_PATH_STUB = '/defapi/manifest';
export const DEFAPI_CONFIG_FILENAME = 'defapi-config.js';
const IDENTIFIER_FILENAME = '.defapiclient';

export function readSources(): DefapiSource[] {
  if (!FS.existsSync(SOURCES_FILE)) {
    console.warn(`"${SOURCES_FILENAME}" file not found.`);
    return [];
  }

  if (require.resolve(SOURCES_FILE)) {
    let sourceData = require(SOURCES_FILE);
    if (!Array.isArray(sourceData)) {
      sourceData = [sourceData];
    }
    return sourceData;
  }
  console.warn(`Unable to read sources file`);
  return [];
}

export function readManifests(): ManifestMap {
  let results: ManifestMap = {};
  if (!FS.existsSync(MANIFESTS_DIR)) {
    conprint.notice('No manifests dir');
    return results;
  }

  const entries = FS.readdirSync(MANIFESTS_DIR);
  if (entries) {
    for (let entry of entries) {
      if (entry.endsWith('.json')) {
        const key = entry.replace(/\.json$/, '');
        const file = Path.join(MANIFESTS_DIR, entry);
        results[key] = require(file) as ApiManifest;
      }
    }
  }
  return results;
}

export function writeManifest(name: string, manifest: ApiManifest) {
  FS.ensureDirSync(MANIFESTS_DIR);
  const file = Path.join(MANIFESTS_DIR, `${name}.json`);
  const output = JSON.stringify(manifest, null, 2);
  FS.writeFileSync(file, output, { encoding: 'utf-8' });
}

export function writeSourcesFile(sources: DefapiSource[]) {
  let sourcesString = '[\n';
  for (let source of sources) {
    sourcesString += JSON.stringify(source, null, 2) + ',\n';
  }
  sourcesString += ']';

  const output = `/**
 * @type {DefapiSource | DefapiSource[]}
 */
module.exports = ${sourcesString};`;

  FS.writeFileSync(SOURCES_FILE, output, { encoding: 'utf-8' });
}

export const conprint = {
  info(msg: string, data?: any) {
    if (data) {
      return console.log(chalk.blueBright(msg), data);
    }
    console.log(chalk.blueBright(msg));
  },
  success(msg: string, data?: any) {
    if (data) {
      return console.log(chalk.greenBright(msg), data);
    }
    console.log(chalk.greenBright(msg));
  },
  error(msg: string | Error, data?: any) {
    const _msg = typeof msg == 'string' ? msg : msg.message;
    if (data) {
      return console.log(chalk.red(_msg), data);
    }
    console.log(chalk.red(_msg));
  },
  notice(msg: string, data?: any) {
    if (data) {
      return console.log(chalk.yellow(msg), data);
    }
    console.log(chalk.yellow(msg));
  }
};

export function isDefapiClientProj() {
  return FS.existsSync(Path.join(process.cwd(), IDENTIFIER_FILENAME));
}
