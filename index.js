#!/usr/bin/env node

const { cd, exec, pwd } = require("shelljs");
const prompts = require("prompts");
const { z } = require("ztrings");
const meow = require("meow");
const ora = require("ora");

const { helpMessage, settings, verboseLog } = require("./src/settings");
const { Errors, throwError } = require("./src/errors");
const getCommandsFilePath = require("./src/get-commands-filepath");
const readJSONFileContent = require("./src/read-json-file-content");
const getChoices = require("./src/get-choices");

const run = async () => {
  const BASE_PATH = pwd();
  const filename = "get_up_and_run.json";
  const PROXIES = {
    linux: 'gnome-terminal --tab -- bash -c "__COMMAND__"',
    darwin: `osascript \
							-e 'tell application "Terminal" to activate' \
							-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' \
							-e 'tell application "Terminal" to do script "__COMMAND__" in selected tab of the front window'`,
    win32: Errors.WIP_notice, // TODO
  };
  const SUPPORTED_PLATFORMS = ["linux", "darwin"];
  const proxy = PROXIES[process.platform];
  const cli = meow(helpMessage, settings);
  const { log, table } = console;
  const { input, flags } = cli;
  const { verbose, debug } = flags;

  let commands = null;

  const spinner = ora({
    text: `Looking for "${filename}" 🔍`,
    color: "blue",
  }).start();

  if (!SUPPORTED_PLATFORMS.includes(process.platform))
    throwError(spinner, Errors.unsupported_platform);

  if (input.length > 1) throwError(spinner, Errors.wrong_amount_of_arguments);

  const { filePath, error } = await getCommandsFilePath(BASE_PATH, filename);

  if (error) throwError(spinner, error);
  if (verbose) verboseLog(`Found commands in "${filePath}"`);
  spinner.text = `Found "${filename}" in ${filePath}`;

  const fileContent = readJSONFileContent(filePath);

  if (!input.length) {
    spinner.stop();
    const choices = getChoices(fileContent);
    const { choice } = await prompts({
      type: "select",
      name: "choice",
      choices,
      message: "What commands you want to run?",
    });
    commands = fileContent[choices[choice].title];
    spinner.start();
  }

  if (debug) table(fileContent);

  if (commands === null) {
    commands = input[0];
  }

  if (debug) table(commands);
  if (commands === null)
    throwError(spinner, `Couldn't find any commands to run`);

  spinner.text = `Running commands 🔨`;
  for (let i = 0; i < commands.length; i += 1) {
    if (verbose) verboseLog(`moving to ${BASE_PATH}`);
    cd(BASE_PATH);
    const command = commands[i];
    const fullCommand = proxy.replace("__COMMAND__", command);
    if (verbose) log(z`{dim Executing Command #${i + 1}: ${fullCommand}}`);
    if (!debug)
      exec(fullCommand, { silent: true }, (code, stdout, stderr) => {
        if (verbose) {
          log(z`{dim Finished running command #${i + 1}}`);
          log(z`{dim \tExit code ${code}}`);
          log(z`{dim \tStdout: ${stdout}}`);
          log(z`{dim \tStderr: ${stderr}}`);
          log(
            "--------------------------------------------------------------------"
          );
        }
      });
  }

  setTimeout(() => {
    spinner.stop();
    log(z`{bright All done, have fun!}`);
  }, 1000);
};

run();
