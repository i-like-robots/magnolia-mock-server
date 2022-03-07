const path = require("path");
const yaml = require("yaml");
const { getFiles } = require("./fileUtils");

function findContent(source) {
  const globPattern = path.join(source, "**/website.*.yaml");
  return getFiles(globPattern);
}

async function getContent(options) {
  const files = await findContent(options.source);

  const content = {};

  files.forEach((file) => {
    const data = yaml.parse(file);
    Object.assign(content, data);
  });

  return content;
}

module.exports = { findContent, getContent };
