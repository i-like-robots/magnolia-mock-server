const { query, validationResult } = require("express-validator");

async function validationMiddleware(req, res, next) {
  await query("depth").optional().isInt({ min: 0, max: 10 }).toInt().run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  next();
}

module.exports = { validationMiddleware };
