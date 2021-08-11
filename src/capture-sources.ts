import { conprint, FS, Path } from './deps';
import { MANIFEST_ROUTE_PATH_STUB, MANIFESTS_DIR, readSources } from './common';

const got = require('got');

async function fetchDefapiManifest(key: string, baseUrl: string) {
  let responseText: string | null = null;
  let manifestUrl = `${baseUrl}${MANIFEST_ROUTE_PATH_STUB}`;
  try {
    const { body } = await got.get(manifestUrl, { responseType: 'json' });
    if (body) {
      responseText = body;
      conprint.info(`Defapi manifest for ${key} fetched`);
    } else {
      conprint.notice(`Empty response for ${key} fetched from ${manifestUrl}`);
    }
  } catch (e) {
    switch (e.code) {
      case 'ECONNREFUSED':
        conprint.error('[Error fetching manifest] Connection refused', {
          key,
          url: manifestUrl,
          code: e.code,
          message: e.message
        });

        return;
      case 'ECONNRESET':
        conprint.error('[Error fetching manifest] Connection reset', {
          key,
          url: manifestUrl,
          code: e.code,
          message: e.message
        });

        return;
      default:
        conprint.error('[Error fetching manifest]', { key, url: manifestUrl, e });
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
      conprint.error('Error writing manifest', { key, url: manifestUrl, e });
    }
  }
}

export async function captureSources() {
  let sources = readSources();
  for (let { name, baseUri } of sources) {
    if (baseUri) {
      await fetchDefapiManifest(name, baseUri as string);
    }
  }
}
