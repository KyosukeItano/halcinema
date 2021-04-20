const express = require("express")
const db = require("../../config/mysql")()
const debug = require("debug")("app:usersRoutes")

const isLogin = require("../../middleware/isLogin")
const usersRouter = express.Router()

module.exports = () => {

  usersRouter.route("/login").get((req, res) => {
    if (req.isAuthenticated() && req.user) {
      return res.redirect("/home/today_schedule")
    }
    res.render("user/users/login")
  })

  usersRouter.route("/sign_up").get((req, res) => {
    if (req.isAuthenticated() && req.user) {
      return res.redirect("/home/today_schedule")
    }
    res.render("user/users/sign_up")
  })

  usersRouter.route("/customer").get(isLogin, (req, res) => {
    const email = req.user.email
    const sql = "SELECT * FROM user WHERE email = ?;"
    db.query(sql, [email], (err, result) => {
      if (err) {
        throw err
      }
      const [userData] = result
      const ticketSql = "SELECT movie_info.movieId,cinemaId,movieName,GROUP_CONCAT(seat.seat) AS seats,plas,runs,runday,screen,poster FROM seat INNER JOIN schedule ON seat.runId=schedule.runId INNER JOIN movie_info ON schedule.movieId=movie_info.movieId WHERE seat.email=? GROUP BY seat.runId;"
      db.query(ticketSql, [email], (ticketErr, ticketResult) => {
        if (ticketErr) {
          throw ticketErr
        }
        debug(ticketResult)
        res.render("user/users/customer", { userData, ticketResult })
      })
    })
  })

  usersRouter.route("/account_edit").get(isLogin, (req, res) => {
    res.render("user/users/acount_edit", {})
  })

  return usersRouter
}