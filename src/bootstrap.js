const app = require("./app");
const MagnoliaAPI = require("./MagnoliaAPI");
const { loadContent } = require("./contentUtils");

const defaultOptions = {
  port: 5000,
  sourceDir: "./content",
  depth: 10,
  nodeTypes: ["mgnl:page"],
  childNodeTypes: [
    "mgnl:page",
    "mgnl:area",
    "mgnl:component",
    "mgnl:contentNode",
  ],
};

async function bootstrap(userOptions) {
  const options = { ...defaultOptions, ...userOptions };
  const content = await loadContent({ source: options.sourceDir });
  const magnolia = new MagnoliaAPI(content, options);

  Object.assign(app.locals, { content, magnolia });

  app.listen(options.port, (err) => {
    if (err) throw err;
    console.log(`Server running at http://localhost:${options.port}`);
  });
}

module.exports = bootstrap;
