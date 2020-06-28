const exitProcess = () => process.exit(0);

module.exports = {
  exitProcess,
  Errors: {
    WIP_notice: "Sorry, WIP!",
    wrong_amount_of_arguments: "Expected 1 argument",
    unsupported_platform: "Platform not supported",
  },
  throwError: (spinner, msg, exit = true) => {
    spinner.fail(msg);
    if (exit) exitProcess();
  },
};
