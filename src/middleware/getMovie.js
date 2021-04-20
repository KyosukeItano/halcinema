const db = require("../config/mysql")()

module.exports = (req, res, next) => {
  const id = req.param("id")
  const sql = "SELECT * FROM movie_info WHERE movieId = ?;"
  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err
    }
    if (!result.length) {
      return res.send("該当する映画情報が見つかりませんでした")
    }
    req.movie = result[0]
    next()
  })
}