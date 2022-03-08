const get = require("just-safe-get");
const { transformNodes } = require("./magnoliaUtils");

class MagnoliaAPI {
  constructor(content, options) {
    this.content = content;
    this.options = options;
  }

  getContent(path) {
    const target = path.split("/").filter(Boolean);
    const node = get(this.content, target);

    if (node) {
      const normalizedPath = `/${target.join("/")}`;
      return transformNodes(node, normalizedPath, this.options);
    }
  }

  getContentNodes(path) {
    const content = this.getContent(path);

    if (content) {
      const nodes = [];

      page["@nodes"].forEach((node) => {
        nodes.push(page[node]);
      });

      return nodes;
    }
  }
}

module.exports = MagnoliaAPI;
