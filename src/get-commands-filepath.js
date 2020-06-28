const glob = require("glob");

const getCommandsFilePath = async (base, filename) =>
  new Promise((resolve) => {
    glob(base + `/${filename}`, {}, (error, files) => {
      if (error) resolve({ error });

      if (files) {
        if (files.length > 1)
          resolve({ error: `Please define a "${filename}" file` });
        const [filePath] = files;
        resolve({ filePath });
      } else {
        resolve({ error: `Define a "${filename}"` });
      }
    });
  });

module.exports = getCommandsFilePath;
