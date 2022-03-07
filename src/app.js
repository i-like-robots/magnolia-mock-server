const express = require("express");
const get = require("just-safe-get");
const { getContent } = require("./contentUtils");
const { magnoliaTransform } = require("./magnoliaUtils");

const app = express();

app.get("/.rest/delivery/pages/:path(*)", (req, res) => {
  const path = req.params.path;
  const content = get(app.locals.content, path.split("/").filter(Boolean));

  console.info({ path });

  if (content) {
    const page = magnoliaTransform(content, path);
    res.json(page);
  } else {
    res.status(404).send("Page not found.");
  }
});

// app.get("/.rest/delivery/pages/:path(*)/@nodes", (req, res) => {});

async function bootstrap() {
  try {
    app.locals.content = await getContent({ source: "./content" });
    return app;
  } catch (err) {
    throw new Error(`Failed to load content: ${err.message}`);
  }
}

module.exports = { app, bootstrap };
