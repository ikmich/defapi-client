import { cliyargs, ClyBaseCommand } from 'cliyargs';
import { IOptions } from './index';
import { isDefapiClientProj, SOURCES_FILE, SOURCES_FILENAME, writeSourcesFile } from '../common';
import { conprint, FS } from '../deps';

export class InitCommand extends ClyBaseCommand<IOptions> {
  async run() {
    if (!isDefapiClientProj()) {
      const answer = (await cliyargs.askSelect(
        'opt-proceed-init',
        `Looks like this is NOT a defapi-client project. Would you like to proceed and create the ${SOURCES_FILENAME} file in this project?`,
        ['Proceed', 'Cancel']
      )) as string;

      if (answer?.toLowerCase() == 'cancel') {
        conprint.notice('Ignoring...');
        return;
      }
    }
    await super.run();

    if (FS.existsSync(SOURCES_FILE)) {
      const msg = 'A `defapi.sources.js` file already exists. Would you like to replace it?';
      const answer: string = <string>await cliyargs.askSelect('opt-overwrite-sources', msg, ['Yes', 'No']);
      if (answer?.toLowerCase() == 'no') {
        conprint.notice('Ignoring...');
        return;
      }
    }

    writeSourcesFile([
      {
        name: '',
        label: '',
        baseUri: ''
      }
    ]);

    conprint.success(`'${SOURCES_FILENAME}' has been created.`);
  }
}
