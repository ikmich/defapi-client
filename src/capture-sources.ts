import { FS, Path } from './deps';
import { MANIFESTS_DIR, readSources } from './common';
const got = require('got');

async function fetchDefapiManifest(key: string, url: string) {
  let responseText: string | null = null;
  try {
    const { body } = await got.get(url, { responseType: 'json' });
    if (body) {
      responseText = body;
      console.log(`Defapi manifest for ${key} fetched from ${url}`);
    } else {
      console.warn(`Empty response for ${key} fetched from ${url}`);
    }
  } catch (e) {
    switch (e.code) {
      case 'ECONNREFUSED':
        return console.error('[Error fetching manifest] Connection refused', {
          key,
          url,
          code: e.code,
          message: e.message
        });
      case 'ECONNRESET':
        return console.error('[Error fetching manifest] Connection reset', {
          key,
          url,
          code: e.code,
          message: e.message
        });
      default:
        console.error('[Error fetching manifest]', { key, url, e });
    }
  }

  if (responseText && responseText.length) {
    try {
      const manifestObj = JSON.parse(responseText);
      const outputString = JSON.stringify(manifestObj.data, null, 2);
      FS.ensureDirSync(MANIFESTS_DIR);

      const targetFile = Path.join(MANIFESTS_DIR, `${key}.json`);
      FS.writeFileSync(targetFile, outputString, { encoding: 'utf-8' });
    } catch (e) {
      console.error('Error writing manifest', { key, url, e });
    }
  }
}

export async function captureSources() {
  let sources = readSources();
  for (let { name, manifestUrl } of sources) {
    if (manifestUrl) {
      await fetchDefapiManifest(name, manifestUrl as string);
    }
  }
}
