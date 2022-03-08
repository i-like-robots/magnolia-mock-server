const get = require("just-safe-get");
const urlJoin = require("proper-url-join");

function getNodeID(node) {
  return node["jcr:uuid"] || node["@id"] || null;
}

function getNodeType(node) {
  return node["jcr:primaryType"] || node["@nodeType"] || null;
}

function isNode(node) {
  return node ? typeof getNodeID(node) === "string" : false;
}

function isPage(node) {
  return isNode(node) && getNodeType(node) === "mgnl:page";
}

function isArea(node) {
  return isNode(node) && getNodeType(node) === "mgnl:area";
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
  } else if (isArea(node)) {
    return getAreaNodes(node);
  } else if (isMultiField(node, name)) {
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
    "@nodes": [],
  };

  const remove = {
    "jcr:primaryType": undefined,
    "jcr:uuid": undefined,
  };

  return { ...node, ...append, ...remove };
}

function transformNodes(node, path, options, depth = 1) {
  const data = transformNode(node, path);

  Object.keys(data).forEach((key) => {
    const item = data[key];

    if (isNode(item)) {
      if (depth < options.depth) {
        const basePath = urlJoin(path, key);
        data[key] = transformNodes(item, basePath, options, depth + 1);
      } else {
        data[key] = undefined;
      }
    }
  });

  data["@nodes"].push(...getChildNodes(data, path));

  return data;
}

function getMagnoliaContent(content, path, options) {
  const target = path.split("/").filter(Boolean);
  const node = get(content, target);

  if (node) {
    const normalizedPath = urlJoin(path);
    return transformNodes(node, normalizedPath, options);
  }
}

function getMagnoliaNodes(page) {
  const children = [];

  page["@nodes"].forEach((node) => {
    if (isPage(page[node])) {
      children.push(page[node]);
    }
  });

  return children;
}

module.exports = { getMagnoliaContent, getMagnoliaNodes };
