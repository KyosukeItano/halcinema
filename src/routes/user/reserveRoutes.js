const express = require("express")
const debug = require("debug")("app:reserveRoutes")
const db = require("../../config/mysql")()

const reserveRouter = express.Router()
const getCinemaInfo = require("../../middleware/getCinemaInfo")

let connects = []

module.exports = () => {

    reserveRouter.route("/:runId").all((req, res, next) => {
        if (!req.isAuthenticated() || !req.user) {
            res.redirect("/users/login")
        }
        const runId = req.param("runId")
        const sql = "SELECT * FROM schedule INNER JOIN movie_info on schedule.movieId = movie_info.movieId WHERE schedule.runId = ?;"
        db.query(sql, [runId], (err, result) => {
            if (err) {
                return res.redirect("/error")
                throw err
            }
            if (!result.length) return res.send("該当するスケジュールはございません。")
            req.schedule = result[0]
            next()
        })
    }, getCinemaInfo).get((req, res) => {
        const runId = req.param("runId")
        const test = connects.filter((conn) => {
            return conn.runId === runId ? true : false
        })
        if (test.length) return res.render("user/reserve/product_seat", { ...req.schedule, email: req.user.email, lock: true })
        res.render("user/reserve/product_seat", { ...req.schedule, email: req.user.email, lock: false, cinemaName: req.session.cinemaName })
    })

    reserveRouter.ws("/ws/:runId", (ws, req) => {
        const runId = req.param("runId")

        connects.push({ runId, ws })
        ws.on('close', () => {
            connects = connects.filter(conn => {
                return (conn.ws === ws) ? false : true;
            });
            debug(connects)
        });
    })

    return reserveRouter
}