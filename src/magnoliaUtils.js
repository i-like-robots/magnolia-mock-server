function isJCRNode(node) {
  return node ? typeof node["jcr:uuid"] === "string" : false;
}

function isMagnoliaNode(node) {
  return node ? typeof node["@id"] === "string" : false;
}

function isValidJCRNodeType(node, types = []) {
  const type = node["jcr:primaryType"] || "mgnl:contentNode";
  return type && types.includes(type);
}

function getJCRNodeChildKeys(node) {
  return Object.keys(node).filter((key) => isJCRNode(node[key]));
}

function getMagnoliaNodeChildKeys(node) {
  return Object.keys(node).filter((key) => isMagnoliaNode(node[key]));
}

function transformJCRNode(node, path, options, depth = 0) {
  const clone = {
    "@name": path.split("/").pop(),
    "@path": path,
    "@id": node["jcr:uuid"],
    "@nodeType": node["jcr:primaryType"] || "mgnl:contentNode",
  };

  Object.keys(node).forEach((key) => {
    const prop = node[key];

    if (key.startsWith("jcr:")) return;

    if (isJCRNode(prop)) {
      const maxDepth = depth >= options.depth;

      if (!maxDepth && isValidJCRNodeType(prop, options.childNodeTypes)) {
        const newPath = `${path}/${key}`;
        clone[key] = transformJCRNode(prop, newPath, options, depth + 1);
      }
    } else {
      clone[key] = prop;
    }
  });

  clone["@nodes"] = getMagnoliaNodeChildKeys(clone);

  return clone;
}

module.exports = { isValidJCRNodeType, transformJCRNode, getJCRNodeChildKeys };
