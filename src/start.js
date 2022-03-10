const bootstrap = require("./bootstrap");

try {
  bootstrap({ port: process.env.PORT ?? 5000 });
} catch (err) {
  console.error(err);
  process.exit(1);
}
