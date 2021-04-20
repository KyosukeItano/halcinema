const db = require("../config/mysql")()

module.exports = (req, res, next) => {
  const sql = "SELECT * FROM cinema INNER JOIN admin on cinema.cinemaId = admin.cinemaId WHERE admin.name = ?;"
  db.query(sql, req.user.email, (err, result) => {
    if (err) {
      res.redirect("/admin")
      throw err
    }
    req.cinemaName = result[0].cinemaName
    req.cinemaId = result[0].cinemaId
    next()
  })
}