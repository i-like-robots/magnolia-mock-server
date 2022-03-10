const path = require("path");
const yaml = require("yaml");
const { getFiles } = require("./fileUtils");

function findContent(source) {
  const globPattern = path.join(source, "**/website.*.yaml");
  return getFiles(globPattern);
}

async function loadContent(options) {
  const files = await findContent(options.source);

  console.info(`Found ${files.length} source files in ${options.source}`);

  const content = {};

  files.forEach((file) => {
    const data = yaml.parse(file);
    Object.assign(content, data);

    console.info(`Loaded root pages: ${Object.keys(data)}`);
  });

  return content;
}

module.exports = { findContent, loadContent };
