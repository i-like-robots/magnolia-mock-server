const get = require("just-safe-get");
const { transformNodes } = require("./magnoliaUtils");

class MagnoliaAPI {
  constructor(content, options) {
    this.content = content;
    this.options = options;
  }

  getNode(path) {
    const target = path.split("/").filter(Boolean);
    const node = get(this.content, target);

    if (node) {
      const normalizedPath = `/${target.join("/")}`;
      return transformNodes(node, normalizedPath, this.options);
    }
  }

  getChildNodes(path) {
    const node = this.getNode(path);

    if (node) {
      const nodes = [];

      node["@nodes"].forEach((key) => {
        nodes.push(node[key]);
      });

      return nodes;
    }
  }
}

module.exports = MagnoliaAPI;
