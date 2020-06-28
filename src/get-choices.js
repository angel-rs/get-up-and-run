const prettyPrintCommands = (commands) =>
  commands.reduce((acum, curr, i) => {
    const { length } = commands;
    const first = 0;
    const last = length - 1;
    if (i === first) {
      acum = "Commands: [\n";
    }
    acum += `.\t\t‎‎‎‎‎‎‎‏‏‎${curr}\n`;
    if (i === last) {
      acum += "]";
    }

    return acum;
  }, "");

// Add support for object syntax later? i.e: domain1.section1.task1
const getChoices = (json) =>
  Object.keys(json).map((key, i) => ({
    title: key,
    value: i,
    description: prettyPrintCommands(json[key]),
  }));

module.exports = getChoices;
