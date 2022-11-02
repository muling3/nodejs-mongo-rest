module.exports = (err, req, res, next) => {
  let status = res.statusCode ? res.statusCode : 500;

  res.status(status).json({ ok: false, error: err.message, stack: err.stack });
};
