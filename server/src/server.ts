import { env } from './env';
import express from 'express';
import { captureSources } from './capture-sources';
import cors from 'cors';
import { applyRoutes } from './routes';
import { CLIENT_DIR } from './common';

const app = express();
app.use(cors());
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

applyRoutes(app);

app.listen(env.port, () => {
  captureSources().catch((err) => {
    console.error(err);
  });
  console.log(`defapi-client is being served on port ${env.port}`);
});

