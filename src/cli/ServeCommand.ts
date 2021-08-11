import { ClyBaseCommand } from 'cliyargs';
import { IOptions } from './index';
import Path from 'path';
import { spawn } from 'child_process';
import { conprint, DEFAPI_CONFIG_FILENAME, writeSourcesFile } from '../common';
import { ApiManifest, DefapiConfig } from '../../index';

const kill = require('kill-port');
const getPort = require('get-port');
const got = require('got');

export class ServeCommand extends ClyBaseCommand<IOptions> {
  private async getPort() {
    return String(this.options.port?.toLowerCase() || (await getPort()));
  }

  private getBaseUri() {
    let configBaseUri = '';

    // Ret base uri from defapi config file
    const defapiConfigFile = Path.join(process.cwd(), DEFAPI_CONFIG_FILENAME);
    if (require.resolve(defapiConfigFile)) {
      const config: DefapiConfig = require(defapiConfigFile);
      if (config && config.api && config.api.baseUri) {
        configBaseUri = typeof config.api.baseUri == 'string' ? config.api.baseUri : config.api.baseUri();
      }
    }

    let cliOptionBaseUri = String(this.options.baseUri || '');

    if (!configBaseUri && !cliOptionBaseUri) {
      const msg = `[defapi-client.ERROR] Cannot find baseUri. Either:
  * Provide a valid baseUri in your project's 'defapi-config.js' file. 
    - OR -
  * Pass a --baseUri option to the 'defapi-client' serve command`;
      conprint.notice(msg);
      return;
    }

    let baseUri = configBaseUri ? configBaseUri : cliOptionBaseUri;

    if (!baseUri.startsWith('http://') && !baseUri.startsWith('https://')) {
      baseUri = `http://${baseUri}`;
    }

    return baseUri;
  }

  async run(): Promise<void> {
    await super.run();

    try {
      const baseUri = this.getBaseUri();
      if (!baseUri) return;

      let manifestUrl = `${baseUri}/defapi/manifest`;
      const { body } = await got.get(manifestUrl, { responseType: 'json' });
      const bodyObject = JSON.parse(body);
      const manifest = bodyObject.data as ApiManifest;
      if (!manifest) {
        conprint.notice('[defapi-client.ERR] No manifest. Is the baseUri correct?');
        return;
      }

      const manifestTitle = manifest.title ? manifest.title : 'Defapi API';
      let manifestName = manifestTitle.toLowerCase().replace(/\s+/gi, '_');

      // Write defapi sources
      writeSourcesFile([
        {
          name: manifestName,
          label: manifest.title,
          baseUri: baseUri
        }
      ]);
    } catch (e) {
      conprint.error('[defapi-client.ERR] Error writing manifest', { e });
      return;
    }

    const port = await this.getPort();
    if (port) {
      this.execServe(port);
    }
  }

  private execServe(port: string) {
    const serverFile = Path.join(__dirname, '../../dist/server/index.js');

    let proc = spawn('node', [serverFile, `--port=${port}`, `--id=defapi-client-cli`]);

    proc.stdout.on('data', (data) => {
      if (data) {
        console.log('> ' + data.toString().replace(/\r\n$/, ''));
      }
    });

    proc.stderr.on('data', (data) => {
      if (data) {
        conprint.error('> ' + data.toString().replace(/\r\n$/, ''));
      }
    });

    proc.on('error', (error) => {
      conprint.error(error);
    });

    proc.on('close', (code, signal) => {
      console.log(`> Closing with code ${code} (${signal})`);
      kill(port, 'tcp').then(console.log).catch(conprint.error);
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
