const top5Middleware = (req, res, next) => {
  req.query.sort = "price -ratingsAverage";
  req.query.limit = 5;
  next();
};

module.exports = { top5Middleware };
