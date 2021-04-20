const express = require("express")
const db = require("../config/mysql")()
const debug = require("debug")("app:adminRoutes")
const nl2br = require("nl2br")
const multer = require("multer")
const adminRouter = express.Router()
const adminCinema = require("../middleware/adminCinema")
const getMovies = require("../middleware/getMovies")
const getMovie = require("../middleware/getMovie")

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploaded/posters/")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.movieName + ".jpg")
    }
})
const upload = multer({ storage: storage }).single('poster')

const movieList = [
    {
        movieId: "1",
        movieName: "天気の子",
        movieImg: "/images/poster/c01.jpg"
    },
    {
        movieId: "2",
        movieName: "JOKER",
        movieImg: "/images/poster/c02.jpg"
    },
    {
        movieId: "3",
        movieName: "君の名は。",
        movieImg: "/images/poster/c03.jpg"
    },
    {
        movieId: "4",
        movieName: "キセキ",
        movieImg: "/images/poster/c04.jpg"
    },
    {
        movieId: "5",
        movieName: "セッション",
        movieImg: "/images/poster/c05.jpg"
    },
    {
        movieId: "6",
        movieName: "心が叫びたがってるんだ",
        movieImg: "/images/poster/c06.jpg"
    },
    {
        movieId: "7",
        movieName: "君の名は。",
        movieImg: "/images/poster/c03.jpg"
    },
]

module.exports = () => {
    adminRouter.route("/").get(adminCinema, (req, res) => {
        res.render("admin/index", { cinemaId: req.cinemaId, cinemaName: req.cinemaName })
    })

    adminRouter.route("/login").get((req, res) => {
        if (req.isAuthenticated() && req.user.role === "admin") {
            return res.redirect("/admin")
        }
        res.render("admin/login")
    })

    adminRouter.route("/mail").get((req, res) => {
        res.render("admin/mail")
    })

    adminRouter.route("/pdf").get((req, res) => {
        res.render("admin/pdf")
    })

    adminRouter.route("/production_add").get((req, res) => {
        res.render("admin/production_add", { success: false })
    }).post(upload, (req, res) => {
        debug("movieName:", req.body)
        debug("file:", req.file)
        const filePath = "/" + req.file.path
        const info = req.body
        const data = [info.movieName, info.director, info.explain, info.cast, info.rating, info.runs, info.releaseDay, filePath]
        const sql = "INSERT INTO movie_info VALUES(null,?,?,?,?,?,?,?,1,?);"
        db.query(sql, data, (err, result) => {
            if (err) {
                throw err
            }
            res.render("admin/production_add", { success: true })
        })
    })

    adminRouter.route("/production_content/:id").get(getMovie, (req, res) => {
        res.render("admin/production_content", { ...req.movie, explain: nl2br(req.movie.explain, false) })
    })

    adminRouter.route("/production_edit").get((req, res) => {
        res.render("admin/production_edit")
    })

    adminRouter.route("/production_list").get(getMovies, (req, res) => {
        res.render("admin/production_list", { movieList: req.movies })
    })

    adminRouter.route("/screen_schedule/:date").get(adminCinema, getMovies, (req, res) => {
        const date = req.param("date")
        res.render("admin/screen_schedule", { date, cinemaId: req.cinemaId, cinemaName: req.cinemaName, movieList: req.movies })
    }).post((req, res) => {
        debug(req.body)
        const data = req.body
        const schedule = [data.cinemaId, data.movieId, data.runday, data.screen, data.plas]
        const sql = "INSERT INTO schedule VALUES(null,?,?,?,?,?,DEFAULT);"
        db.query(sql, schedule, (err, result) => {
            if (err) {
                throw err
            }
            res.json(result)
        })
    })

    return adminRouter
}