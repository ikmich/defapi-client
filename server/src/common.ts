import { ApiManifest, DefapiSource, ManifestMap } from '../../index';
import { FS, Path } from './deps';

export const CLIENT_DIR = Path.join(__dirname, '../../client/dist');
export const MANIFESTS_DIR = Path.join(CLIENT_DIR, 'manifests/');
export const SOURCES_DIR = process.cwd();
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
