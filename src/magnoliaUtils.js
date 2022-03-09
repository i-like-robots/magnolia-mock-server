function isJCRNode(node) {
  return node ? typeof node["jcr:uuid"] === "string" : false;
}

function isMagnoliaNode(node) {
  return node ? typeof node["@id"] === "string" : false;
}

function getChildNodeKeys(node) {
  return Object.keys(node).filter((key) => isMagnoliaNode(node[key]));
}

function filterNodeType(node, types = []) {
  const type = node["jcr:primaryType"] || "mgnl:contentNode";
  return type && types.includes(type);
}

function transformNode(node, path) {
  const name = path.split("/").pop();

  const append = {
    "@name": name,
    "@path": path,
    "@id": node["jcr:uuid"],
    "@nodeType": node["jcr:primaryType"] || "mgnl:contentNode",
    "@nodes": [],
  };

  const remove = {
    "jcr:primaryType": undefined,
    "jcr:uuid": undefined,
  };

  return { ...node, ...append, ...remove };
}

function transformNodes(node, path, options, depth = 0) {
  const clone = transformNode(node, path);

  Object.keys(clone).forEach((key) => {
    const prop = clone[key];

    if (isJCRNode(prop)) {
      if (
        depth < options.depth &&
        filterNodeType(prop, options.childNodeTypes)
      ) {
        const basePath = `${path}/${key}`;
        clone[key] = transformNodes(prop, basePath, options, depth + 1);
      } else {
        clone[key] = undefined;
      }
    }
  });

  clone["@nodes"] = getChildNodeKeys(clone);

  return clone;
}

module.exports = { transformNode, transformNodes };
