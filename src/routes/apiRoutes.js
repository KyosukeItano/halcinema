const express = require("express")
const db = require("../config/mysql")()
const debug = require("debug")("app:api")
const Schedule = require("../models/Schedule")
const { json } = require("body-parser")
const osu = require('node-os-utils')

const apiRouter = express.Router()
const cpu = osu.cpu
const mem = osu.mem

module.exports = () => {

  apiRouter.route("/delMovie/:movieId").post((req, res) => {
    if (!req.isAuthenticated || !req.user.role === "admin") {
      res.send("permission denined.")
    }
    const id = req.param("movieId")
    debug(id)
    const sql = "DELETE FROM movie_info WHERE movieId = ?;"
    db.query(sql, [id], (err, result) => {
      debug(result)
      if (err) {
        return res.status("504").json()
        throw err
      }
      res.json(result)
    })
  })

  apiRouter.route("/getSchedule/:date").get((req, res) => {
    const date = req.param("date")
    debug(date)
    const cinemaId = req.query.cinemaId
    const sql = "SELECT * FROM schedule INNER JOIN movie_info on schedule.movieId = movie_info.movieId WHERE runday = ? AND cinemaId = ? ORDER BY plas;"
    db.query(sql, [date, cinemaId], (err, result) => {
      if (err) {
        throw err
      }
      const resData = new Schedule(result)
      res.json(resData.schedule)
    })
  })

  apiRouter.route("/delSchedule/:runId").post((req, res) => {
    if (!req.isAuthenticated || !req.user.role === "admin") {
      res.send("permission denined.")
    }
    const id = req.param("runId")
    debug(id)
    const sql = "DELETE FROM schedule WHERE runId = ?"
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.redirect("/admin/")
        throw err
      }
      res.json(result[0])
    })
  })

  apiRouter.route("/getCalendar").get((req, res) => {
    const year = req.query.year
    const month = req.query.month
    const cinemaId = req.query.cinemaId
    const min = `${year}-${month}-1`
    const max = `${year}-${month}-31`
    const sql = "SELECT runDay FROM schedule WHERE runday >= ? AND runday <= ? AND cinemaId = ? GROUP BY runDay;"
    db.query(sql, [min, max, cinemaId], (err, result) => {
      if (err) {
        res.status(504), json()
        throw err
      }
      let resData = []
      for (let i = 0; i < result.length; i++) {
        const format = new Date(result[i].runDay).toLocaleDateString()
        resData = [...resData, format.replace(/-/g, '/')]
      }
      debug(resData)
      res.json(resData)
    })
  })

  apiRouter.route("/buyTickets").post((req, res) => {
    console.log(req.body)
    const sql = "INSERT INTO seat VALUES(?,?,?,?,?);"
    const date = new Date()
    const now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    for (let ticket of req.body.stock) {
      db.query(sql, [ticket.runId, ticket.seat, ticket.email, ticket.kind, now], (err, result) => {
        if (err) {
          throw err
        }
        const updateSql = "UPDATE schedule SET seats = seats + 1 WHERE runId = ?;"
        db.query(updateSql, [ticket.runId], (err, result) => {
          if (err) {
            throw err
          }
          res.status(200).json()
        })
      })
    }
  })

  apiRouter.route("/getSeat/:runId").get((req, res) => {
    const runId = req.param("runId")
    const sql = "SELECT * FROM seat WHERE runId = ?;"
    db.query(sql, [runId], (err, result) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
  })

  apiRouter.route("/getMovieSchedule").get((req, res) => {
    if (req.query.cinemaId == "") {
      return res.status(204).json()
    }
    const cinemaId = req.query.cinemaId
    const date = req.query.date
    const movieId = req.query.movieId
    debug(req.query)
    const sql = "SELECT * FROM schedule INNER JOIN movie_info ON schedule.movieId = movie_info.movieId WHERE schedule.movieId = ? AND schedule.cinemaId = ? AND schedule.runday = ?;"
    db.query(sql, [movieId, cinemaId, date], (err, result) => {
      if (err) {
        throw err
      }
      res.json(result)
      debug(result)
    })
  })

  apiRouter.route("/getValue").get((req, res) => {
    const sql = "SELECT * FROM kind"
    db.query(sql, (err, result) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
  })


  /* データ分析 REST */

  // 映画ごとのチケット売り上げ
  apiRouter.route("/getCustomers").get((req, res) => {
    let where = ""
    if ("first" in req.query && "last" in req.query) {
      where = `WHERE movie_info.releaseDay > ? AND movie_info.releaseDay < ?`
    }
    const sql = `SELECT movie_info.movieId,movieName,releaseDay,count(seat.runId) as count FROM movie_info LEFT OUTER JOIN schedule ON schedule.movieId = movie_info.movieId LEFT OUTER JOIN seat ON seat.runId = schedule.runId ${where} GROUP BY movie_info.movieId ORDER BY movie_info.releaseDay;`
    db.query(sql, [req.query.first, req.query.last], (err, result) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
  })

  apiRouter.route("/getSales").get((req, res) => {
    let where = ""
    if ("first" in req.query && "last" in req.query) {
      where = `WHERE movie_info.releaseDay > ? AND movie_info.releaseDay < ?`
    }
    const sql = `SELECT movie_info.movieId,movieName,releaseDay,count(seat.runId) as count,SUM(kind.value)/1000 as value FROM movie_info LEFT OUTER JOIN schedule ON schedule.movieId = movie_info.movieId LEFT OUTER JOIN seat ON seat.runId = schedule.runId LEFT OUTER JOIN kind ON seat.kind = kind.kind ${where} GROUP BY movie_info.movieId ORDER BY movie_info.releaseDay;`
    db.query(sql, [req.query.first, req.query.last], (err, result) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
  })

  // 1上映ごとの性別割合
  apiRouter.route("/getGenderRatio").get((req, res) => {
    let sql = ""
    const holder = []
    if ("movieId" in req.query) {
      sql = "SELECT count(*) AS count,user.gender AS gender FROM seat INNER JOIN user ON seat.email = user.email INNER JOIN schedule ON seat.runId = schedule.runId WHERE schedule.movieId = ? GROUP BY user.gender ORDER BY user.gender"
      holder.push(req.query.movieId)
    } else {
      sql = "SELECT count(*) AS count,user.gender AS gender FROM seat INNER JOIN user ON seat.email = user.email GROUP BY user.gender"
    }
    db.query(sql, holder, (err, result) => {
      if (err) {
        throw err
      }
      debug(result)
      const resData = [0, 0]
      for (let i = 0; i < result.length; i++) {
        resData[result[i].gender] = result[i].count
      }
      res.json(resData)
    })
  })

  apiRouter.route("/getAllSales").get((req, res) => {
    const sql = "SELECT count(seat.runId) as count,SUM(kind.value)/1000 as value, DATE_FORMAT(`when`, '%Y-%m') AS grouping_column FROM seat LEFT OUTER JOIN schedule ON seat.runId = schedule.runId LEFT OUTER JOIN kind ON seat.kind = kind.kind GROUP BY grouping_column ORDER BY grouping_column LIMIT 12;"
    db.query(sql, (err, result) => {
      if (err) {
        throw err
      }
      debug(result)
      res.json(result)
    })
  })

  apiRouter.route("/getCpuUsage").get((req, res) => {
    (async () => {
      const info = await cpu.usage()
      res.json({ info })
    })()
  })

  apiRouter.route("/getFreeRatio").get((req, res) => {
    (async () => {
      const { freeMemPercentage } = await mem.info()
      const freeCpuPercentage = await cpu.free()
      debug(freeMemPercentage, freeCpuPercentage)
      res.json([freeMemPercentage, freeCpuPercentage])
    })()
  })

  // チケット取得
  apiRouter.route("")

  return apiRouter
}