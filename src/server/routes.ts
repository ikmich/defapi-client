import { Express, Request, Response } from 'express';
import { FS, Path } from '../deps';
import { CLIENT_DIR, MANIFESTS_DIR, readManifests, readSources } from '../common';
import { DefapiSource, ManifestMap } from '../../index';

export function applyRoutes(app: Express) {
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

  // GET SOURCES
  app.get('/api/sources', function (req: Request, res: Response) {
    let sources = readSources();
    res.json(sources);
  });

  app.get('/api/manifests/names', function (req: Request, res: Response) {
    if (FS.existsSync(MANIFESTS_DIR)) {
      const entries = FS.readdirSync(MANIFESTS_DIR, { encoding: 'utf-8' });
      if (entries) {
        return res.json(entries);
      }
    }
    return res.json([]);
  });

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

  // Client route handler.
  app.get('/*', function (req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(Path.join(CLIENT_DIR, 'index.html'));
  });
}
