const chalk = require('chalk')
const { z } = require('ztrings')
const { version } = require('../package.json')

const title = str => chalk.bold.green(str)

const helpMessage = `${chalk.bold('🏃 Get up and Run!')} ${chalk.gray(`v${version}`)}

${title('Description')}
  Setup your working directory in no time.

  ${chalk.dim(`NOTE: each command runs as if they were made from the directory
  the main command was called from`)}

${title('Usage')}
  Define a ${chalk.bold('get_up_and_run.json')} file anywhere in your file system, i.e:

  ${chalk.dim(`{
    "command_suite": [
      "echo 'hi'",
      "echo 'hey'",
      "echo 'ahoy'"
    ],
    "...": [
      ...
    ]
  }`)}

Finally run ${chalk.bold('run command_suite')} and select which command to run

${title('Options')}

  --version        Displays the CLI's current version
  --verbose, -v    Show commands as they run
  --debug,   -d    Enable debug mode (doesn't run commands)`

const settings = {
  flags: {
    version: {
      type: 'boolean',
    },
    verbose: {
      type: 'boolean',
      alias: 'v',
    },
    debug: {
      type: 'boolean',
      alias: 'd',
    }
  },
}

const verboseLog = (msg) => {
  console.log(z`{dim ${msg}}`)
}

module.exports = {
  helpMessage,
  settings,
  verboseLog,
}
