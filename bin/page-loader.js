#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Downloads a page from the network and puts it in the specified directory')
  .version('0.0.1')
  .option('-v, --version', 'output the version [version]', 'version')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .arguments('<pageUrl>')
  .action((pageUrl) => {
    pageLoader(pageUrl, program.opts().output)
      .then(() => console.log('Page was successfully downloaded'))
      .catch((error) => {
        console.error(error.message);
        process.exit(1);
      });
  });
program.parse();
