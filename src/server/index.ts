import { env } from '../env';
import express from 'express';
import cors from 'cors';
import { applyRoutes } from './routes';
import { CLIENT_DIR } from '../common';
import { captureSources } from '../capture-sources';
import yargs from 'yargs';

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

const argv: any = yargs.argv;

// @ts-ignore
let port = argv.port || env.port;

app.listen(port, () => {
  captureSources().catch((err) => {
    console.error(err);
  });

  console.log(`defapi-client is being served at http://localhost:${port}`);
});
