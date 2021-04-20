const express = require("express")
const debug = require("debug")("app:homeRoutes")
const db = require("../../config/mysql")()

const getMovies = require("../../middleware/getMovies")
const isCinema = require("../../middleware/isCinema")
const getCinemaInfo = require("../../middleware/getCinemaInfo")
const homeRouter = express.Router()

module.exports = () => {

  homeRouter.route("/today_schedule").all(getCinemaInfo)
    .get(isCinema, (req, res) => {
      res.render("user/home/today_schedule", { cinemaName: req.session.cinemaName, cinemaId: req.session.cinemaId })
    })

  homeRouter.route("/release_list").all(getCinemaInfo)
    .get((req, res) => {
      const sql = "SELECT * FROM movie_info;"
      db.query(sql, (err, result) => {
        if (err) {
          throw err
        }
        debug(result)
        res.render("user/home/release_list", { movieList: result, cinemaName: req.session.cinemaName, cinemaId: req.session.cinemaId })
      })
    })

  homeRouter.route("/production_list").all(getCinemaInfo)
    .get(getMovies, (req, res) => {
      res.render("user/home/production_list", { movieList: req.movies, cinemaName: req.session.cinemaName, cinemaId: req.session.cinemaId })
    })

  return homeRouter
}