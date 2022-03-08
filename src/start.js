const { bootstrap } = require("./app");

const PORT = process.env.PORT ?? 5000;

const defaultOptions = {
  sourceDir: "./content",
  depth: 10,
};

// TODO: options
bootstrap({ ...defaultOptions })
  .then((app) => {
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
