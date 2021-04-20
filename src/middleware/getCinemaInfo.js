const db = require("../config/mysql")()

module.exports = (req, res, next) => {
    if (req.query.cinemaId) {
        const sql = "SELECT cinemaName FROM cinema WHERE cinemaId = ?;"
        db.query(sql, [req.query.cinemaId], (err, result) => {
            if (err) {
                res.redirect("/")
                throw err
            }
            if (!result.length) return res.redirect("/")
            req.session.cinemaId = req.query.cinemaId
            req.session.cinemaName = result[0].cinemaName
            next()
        })
    } else {
        next()
    }
}