
module.exports = (req, res, next) => {
  if (req.session.cinemaId) {
    return next()
  }
  res.redirect("/")
}