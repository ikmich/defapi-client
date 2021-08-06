import { ClyBaseCommand } from 'cliyargs';
import { IOptions } from './index';
import Path from 'path';
import { spawn } from 'child_process';

const kill = require('kill-port');
const getPort = require('get-port');
const got = require('got');

export class ServeCommand extends ClyBaseCommand<IOptions> {
  async run(): Promise<void> {
    await super.run();

    const baseUri = String(this.options.baseUri ?? '');
    if (!baseUri) {
      throw new Error(
        '[defapi-client] --baseUri option missing. It is required to fetch the api manifest data to be rendered in the browser'
      );
    }

    const { body } = await got.get(`${baseUri}/defapi/manifest`, { responseType: 'json' });
    const manifest = body.data;
    console.log({ manifest });

    const port = String(this.options.port ?? (await getPort()));

    const server = Path.join(__dirname, '../../server/dist/server.js');

    let proc = spawn('node', [server, port, 'defapi-client-cli']);

    proc.stdout.on('data', (data) => {
      if (data) {
        console.log('> ' + data.toString().replace(/\r\n$/, ''));
      }
    });

    proc.stderr.on('data', (data) => {
      if (data) {
        console.error('> ' + data.toString().replace(/\r\n$/, ''));
      }
    });

    proc.on('error', (error) => {
      console.error(error);
    });

    proc.on('close', (code, signal) => {
      console.log(`> Closing with code ${code} (${signal})`);
      kill(port, 'tcp').then(console.log).catch(console.error);
      process.exit(code ?? 0);
    });

    proc.on('exit', (code, signal) => {
      console.log('[Exit]');
    });

    proc.on('message', (message, sendHandle) => {
      if (message) {
        console.log('> ' + `${message.toString()}`);
      }
    });
  }
}
