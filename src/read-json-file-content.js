const fs = require('fs')

const readJSONFileContent = (path) => {
  const file = fs.readFileSync(path, 'utf8')
  const content = JSON.parse(file)
  return content
}

module.exports = readJSONFileContent
