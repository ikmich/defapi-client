import { env } from './env';
import express, { Request, Response } from 'express';
import { FS, Path } from './deps';
import { captureSources } from './capture-sources';

const app = express();

export const CLIENT_DIR = Path.join(__dirname, '../../client/dist');
export const MANIFESTS_DIR = Path.join(CLIENT_DIR, 'manifests/');

app.use(
  express.static(CLIENT_DIR, {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  })
);

app.get('/manifests/names', function (req: Request, res: Response) {
  // const manifestsDir = Path.join(process.cwd(), 'manifests/');
  if (FS.existsSync(MANIFESTS_DIR)) {
    const entries = FS.readdirSync(MANIFESTS_DIR, { encoding: 'utf-8' });
    if (entries) {
      return res.json(entries);
    }
  }
  return res.json([]);
});

app.get('/manifest/:name', function (req: Request, res: Response) {
  const key = req.params.name?.trim();
  if (key && key.length) {
    const fileName = `${key}.json`;
    // const manifestsDir = Path.join(process.cwd(), 'manifests/');
    const filePath = Path.join(MANIFESTS_DIR, fileName);
    const manifestData = require(filePath);
    if (manifestData) {
      return res.json(manifestData);
    }
  }

  // Should error be returned?
  res.json({});
});

app.get('/*', function (req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(Path.join(CLIENT_DIR, 'index.html'));
});

app.listen(env.port, () => {
  captureSources().catch((err) => {
    console.error(err);
  });
  console.log(`defapi-client is being served on port ${env.port}`);
});
