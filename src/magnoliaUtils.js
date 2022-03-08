function isNode(node) {
  return node ? typeof node["jcr:uuid"] === "string" : false;
}

function isPage(node) {
  return isNode(node) && node["jcr:primaryType"] === "mgnl:page";
}

function isArea(node) {
  return isNode(node) && node["jcr:primaryType"] === "mgnl:area";
}

function isMultiField(node, name) {
  return isNode(node) && node.hasOwnProperty(`${name}0`);
}

function getPageNodes(node) {
  return Object.keys(node).filter((key) => {
    return isPage(node[key]) || isArea(node[key]);
  });
}

function getAreaNodes(node) {
  const regexp = /^\d+$/;
  return Object.keys(node).filter((key) => regexp.test(key));
}

function getMultiFieldNodes(node, name) {
  const regexp = new RegExp(`^${name}\\d+$`);
  return Object.keys(node).filter((key) => regexp.test(key));
}

function getChildNodes(node, name) {
  if (isPage(node)) {
    return getPageNodes(node);
  }

  if (isArea(node)) {
    return getAreaNodes(node);
  }

  // TODO: Is multi field parent

  if (isMultiField(node, name)) {
    return getMultiFieldNodes(node, name);
  }

  return [];
}

function transformNode(node, path) {
  const name = path.split("/").pop();

  const append = {
    "@name": name,
    "@path": path,
    "@id": node["jcr:uuid"],
    "@nodeType": node["jcr:primaryType"],
    "@nodes": getChildNodes(node, name),
  };

  const remove = {
    "jcr:primaryType": undefined,
    "jcr:uuid": undefined,
  };

  return { ...node, ...append, ...remove };
}

function transformNodes(node, path, options, depth = 1) {
  const clone = transformNode(node, path);

  Object.keys(clone).forEach((key) => {
    const item = clone[key];

    if (isNode(item)) {
      if (depth < options.depth) {
        const basePath = `${path}/${key}`;
        clone[key] = transformNodes(item, basePath, options, depth + 1);
      } else {
        clone[key] = undefined;
        clone["@nodes"] = clone["@nodes"].filter((node) => node !== key);
      }
    }
  });

  return clone;
}

module.exports = { transformNode, transformNodes };
