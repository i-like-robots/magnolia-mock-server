const get = require("just-safe-get");
const {
  getJCRNodeChildKeys,
  isValidJCRNodeType,
  transformJCRNode,
} = require("./magnoliaUtils");

class MagnoliaAPI {
  constructor(content, options) {
    this.content = content;
    this.options = options;
  }

  getJCRNode(path) {
    const target = path.split("/").filter(Boolean);
    return get(this.content, target);
  }

  getJCRChildNodes(path) {
    const node = this.getJCRNode(path);
    const keys = node ? getJCRNodeChildKeys(node) : [];

    return keys.map((key) => node[key]);
  }

  getMagnoliaNode(path) {
    const node = this.getJCRNode(path);
    return node ? transformJCRNode(node, `/${path}`, this.options) : null;
  }

  getMagnoliaChildNodes(path) {
    const node = this.getJCRNode(path);

    const keys = node ? getJCRNodeChildKeys(node) : [];

    return keys.reduce((results, key) => {
      const child = node[key];

      if (isValidJCRNodeType(child, this.options.nodeTypes)) {
        results.push(transformJCRNode(child, `/${path}/${key}`, this.options));
      }

      return results;
    }, []);
  }
}

module.exports = MagnoliaAPI;
