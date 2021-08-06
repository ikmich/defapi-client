#!/usr/bin/env node
import { cliyargs, IClyCommandInfo, IClyCommandOpts } from 'cliyargs';
import { ServeCommand } from './ServeCommand';

export interface IOptions extends IClyCommandOpts {
  port?: number;
  baseUri?: string;
}

// ----

const argv = cliyargs.yargs.command('serve', 'Serve defapi client').help().argv;

const commandInfo: IClyCommandInfo<IOptions> = cliyargs.parseYargv(argv);

cliyargs.processCommand(commandInfo, async (commandName: string) => {
  switch (commandName) {
    case 'serve':
      await new ServeCommand(commandInfo).run();
      break;

    default:
    // No command. Check options
  }
});
