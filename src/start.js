const { bootstrap } = require("./app");

const PORT = process.env.PORT ?? 5000;

bootstrap()
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
