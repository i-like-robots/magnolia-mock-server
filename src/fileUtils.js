const util = require("util");
const glob = require("glob");
const fs = require("fs/promises");

function findFiles(globPattern) {
  const globPromise = util.promisify(glob);
  return globPromise(globPattern);
}

function loadFiles(filePaths = []) {
  const queue = filePaths.map((filePath) => fs.readFile(filePath, "utf-8"));
  return Promise.all(queue);
}

async function getFiles(globPattern) {
  const files = await findFiles(globPattern);
  return loadFiles(files);
}

module.exports = { findFiles, loadFiles, getFiles };
