const express = require("express")
const debug = require("debug")("app:productionRoutes")
const nl2br = require("nl2br")

const getMovie = require("../../middleware/getMovie")
const productionRouter = express.Router()

module.exports = () => {

  productionRouter.route("/:id").get(getMovie, (req, res) => {
    res.render("user/production/product_content", { ...req.movie, explain: nl2br(req.movie.explain, false), cinemaId: req.session.cinemaId })
  })

  return productionRouter
}