import { Express, Request, Response } from 'express';
import { FS, Path } from '../deps';
import {
  CLIENT_DIR,
  MANIFEST_ROUTE_PATH_STUB,
  MANIFESTS_DIR,
  readManifests,
  readSources,
  writeManifest
} from '../common';
import { DefapiSource, ManifestMap } from '../../index';
import { _fn } from '../utils';

const got = require('got');

export function applyRoutes(app: Express) {
  // Get dashboard data for client
  app.get('/api/dashboard', function (req: Request, res: Response) {
    try {
      let sources: DefapiSource[] = readSources();
      let manifestMap: ManifestMap = readManifests();
      let dashboardData: any = {
        sources: []
      };

      for (let source of sources) {
        dashboardData.sources.push({
          source,
          manifest: manifestMap[source.name]
        });
      }

      res.json(dashboardData);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

  // Get sources data
  app.get('/api/sources', function (req: Request, res: Response) {
    let sources = readSources();
    res.json(sources);
  });

  // Fetch manifest names
  app.get('/api/manifests/names', function (req: Request, res: Response) {
    if (FS.existsSync(MANIFESTS_DIR)) {
      const entries = FS.readdirSync(MANIFESTS_DIR, { encoding: 'utf-8' });
      if (entries) {
        return res.json(entries);
      }
    }
    return res.json([]);
  });

  // Fetch data for a single manifest identified by the name
  app.get('/api/manifests/:name', function (req: Request, res: Response) {
    const key = req.params.name?.trim();
    if (key && key.length) {
      const fileName = `${key}.json`;
      const filePath = Path.join(MANIFESTS_DIR, fileName);
      if (FS.existsSync(filePath) && require.resolve(filePath)) {
        const manifestData = require(filePath);
        if (manifestData) {
          return res.json(manifestData);
        }
      }
      res.status(404).json({ message: `Manifest not found for ${key}` });
    }

    // Should error be returned?
    res.json({});
  });

  app.post('/api/manifests/:name/refresh', async function (req: Request, res: Response) {
    try {
      const inputName = req.params.name;
      if (!inputName) {
        return res.status(400).json({
          message: `'name' req param missing`
        });
      }

      const sources = readSources();
      if (!Array.isArray(sources) || sources.length < 1) {
        return res.status(404).json({
          message: `Manifest source with name ${inputName} is not registered`
        });
      }

      const baseUri = _fn(() => {
        for (let source of sources) {
          if (source.name === req.params.name) {
            return source.baseUri;
          }
        }
        return null;
      });

      if (!baseUri) {
        return res.status(400).json({
          message: `baseUri not found for ${inputName} api`
        });
      }

      const url = `${baseUri}${MANIFEST_ROUTE_PATH_STUB}`;
      const { body } = await got.get(url, { responseType: 'json' });
      if (body) {
        const payload = JSON.parse(body);
        if (payload && payload.data) {
          const manifest = payload.data;
          writeManifest(inputName, manifest);

          return res.json(manifest);
        }

        return res.status(400).json({
          message: `Unable to fetch manifest for ${inputName}`
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: e
      });
    }
  });

  // *******************************************************************************************************

  // Client route handler.
  app.get('/*', function (req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(Path.join(CLIENT_DIR, 'index.html'));
  });
}
