import { ApiManifest, DefapiSource, ManifestMap } from '../index';
import { FS, Path } from './deps';

export const CLIENT_DIR = Path.join(__dirname, '../client/dist');
export const MANIFESTS_DIR = Path.join(CLIENT_DIR, 'manifests/');
export const SOURCES_DIR = Path.join(__dirname, '../');
export const SOURCES_FILE = Path.join(SOURCES_DIR, 'defapi.sources.js');

export function readSources(): DefapiSource[] {
  if (!FS.existsSync(SOURCES_FILE)) {
    console.warn(`"defapi.sources.js" file not found.`);
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
    console.warn(`No manifests dir`);
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
