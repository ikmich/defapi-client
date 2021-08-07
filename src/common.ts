import { ApiManifest, DefapiSource, ManifestMap } from '../index';
import { FS, Path } from './server/deps';

export const CLIENT_DIR = Path.join(__dirname, '../client/dist');
export const MANIFESTS_DIR = Path.join(CLIENT_DIR, 'manifests/');
export const SOURCES_DIR = Path.join(__dirname, '../');
export const SOURCES_FILE = Path.join(SOURCES_DIR, 'defapi.sources.js');

export function readSources(): DefapiSource[] {
  if (require.resolve(SOURCES_FILE)) {
    let sourceData = require(SOURCES_FILE);
    if (!Array.isArray(sourceData)) {
      sourceData = [sourceData];
    }
    return sourceData;
  }
  console.warn('Sources file not found');
  return [];
}

export function readManifests(): ManifestMap {
  let results: ManifestMap = {};
  if (FS.existsSync(MANIFESTS_DIR)) {
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
  console.warn('Manifests not found');
  return results;
}

export function writeManifest(name: string, manifest: ApiManifest) {
  FS.ensureDirSync(MANIFESTS_DIR);
  const file = Path.join(MANIFESTS_DIR, `${name}.json`);
  const output = JSON.stringify(manifest, null, 2);
  FS.writeFileSync(file, output, { encoding: 'utf-8' });
}

export function writeSourcesFile(sources: DefapiSource[]) {
  let sourcesString = '[';
  for (let source of sources) {
    sourcesString += JSON.stringify(source, null, 2) + ',';
  }
  sourcesString += ']';

  const output = `/**
 * @type {DefapiSource | DefapiSource[]}
 */
module.exports = ${sourcesString};`;

  FS.writeFileSync(SOURCES_FILE, output, { encoding: 'utf-8' });
}
