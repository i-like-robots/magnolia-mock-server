function isNode(node) {
  const id = node ? node["jcr:uuid"] || node["@id"] : null;
  return typeof id === "string";
}

function getChildNodeNames(node) {
  return Object.keys(node).filter((key) => isNode(node[key]));
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
    const item = clone[key];

    if (isNode(item)) {
      if (depth < options.depth) {
        const basePath = `${path}/${key}`;
        clone[key] = transformNodes(item, basePath, options, depth + 1);
      } else {
        clone[key] = undefined;
      }
    }
  });

  clone["@nodes"] = getChildNodeNames(clone);

  return clone;
}

module.exports = { transformNode, transformNodes };
