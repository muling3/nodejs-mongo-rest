module.exports = (err, req, res, next) => {
  res
    .status(res.statusCode)
    .json({ ok: false, error: err.message, stack: err.stack });
};
