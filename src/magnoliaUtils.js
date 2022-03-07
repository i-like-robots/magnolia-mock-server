const urlJoin = require("proper-url-join");

function isNode(node) {
  return node ? typeof node["jcr:uuid"] === "string" : false;
}

function isPage(node) {
  return isNode(node) && node["jcr:primaryType"] === "mgnl:page";
}

function isArea(node) {
  return isNode(node) && node["jcr:primaryType"] === "mgnl:area";
}

function isContent(node, name) {
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

function getContentNodes(node, name) {
  const regexp = new RegExp(`^${name}\\d+$`);
  return Object.keys(node).filter((key) => regexp.test(key));
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

  if (isPage(node)) {
    append["@nodes"].push(...getPageNodes(node));
  } else if (isArea(node)) {
    append["@nodes"].push(...getAreaNodes(node));
  } else if (isContent(node, name)) {
    append["@nodes"].push(...getContentNodes(node, name));
  }

  return { ...append, ...node, ...remove };
}

function transformNodes(node, path) {
  const data = transformNode(node, path);

  Object.keys(data).forEach((key) => {
    const item = data[key];

    if (isNode(item)) {
      const basePath = urlJoin(path, key);
      data[key] = transformNodes(item, basePath);
    }
  });

  return data;
}

function getMagnoliaContent(content, path) {
  const basePath = urlJoin(path);
  return transformNodes(content, basePath);
}

function getMagnoliaChildren(page) {
  const children = [];

  page["@nodes"].forEach((node) => {
    if (page[node]["@nodeType"] === "mgnl:page") {
      children.push(page[node]);
    }
  });

  return children;
}

module.exports = { getMagnoliaContent, getMagnoliaChildren };
