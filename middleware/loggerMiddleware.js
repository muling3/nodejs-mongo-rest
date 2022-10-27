module.exports = (req, res, next) => {
  const output = `${req.method}\t ${req.originalUrl}\t HTTP/${req.httpVersion}`;
  console.log(output);

  next();
};
