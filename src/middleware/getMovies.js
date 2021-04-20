const db = require("../config/mysql")()

module.exports = (req, res, next) => {
  const sql = "SELECT * FROM movie_info;"
  db.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    req.movies = result
    next()
  })
}