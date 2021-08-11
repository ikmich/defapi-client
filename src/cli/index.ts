#!/usr/bin/env node
import { cliyargs, IClyCommandInfo, IClyCommandOpts } from 'cliyargs';
import { ServeCommand } from './ServeCommand';
import { InitCommand } from './InitCommand';

export interface IOptions extends IClyCommandOpts {
  baseUri?: string;
  port?: string;
}

// ----

const SERVE_COMMAND = 'serve';
const INIT_COMMAND = 'init';

const argv = cliyargs.yargs
  .command(SERVE_COMMAND, 'Serve defapi client')
  .command(INIT_COMMAND, 'Create sources file, other inits')
  .option('baseUri', {
    type: 'string',
    description: 'Base uri of source api'
  })
  .option('port', {
    alias: 'p',
    type: 'string',
    description: 'Port on which to serve the defapi client'
  })
  .help().argv;

const commandInfo: IClyCommandInfo<IOptions> = cliyargs.parseYargv(argv);

cliyargs.processCommand(commandInfo, async (commandName: string) => {
  switch (commandName) {
    case SERVE_COMMAND:
      await new ServeCommand(commandInfo).run();
      break;
    case INIT_COMMAND:
      await new InitCommand(commandInfo).run();
      break;

    default:
    // No command. Check options
  }
});
