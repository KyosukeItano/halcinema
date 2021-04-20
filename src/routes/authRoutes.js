const express = require("express")
const passport = require("passport")
const debug = require("debug")("app:authRouter")
const db = require("../config/mysql")()
const User = require("../models/User")
const InsertUser = require("../models/InsertUser")

const authRouter = express.Router()

module.exports = () => {

  authRouter.route("/signUp").all((req, res, next) => {
    // 重複確認
    const sql = "SELECT email FROM user WHERE email = ?;"
    db.query(sql, [req.body.email], (err, result) => {
      if (err) {
        res.status(403).json()
        throw err
      }
      if (result.length) return res.status(409).json()
      next()
    })
  }).post((req, res) => {
    // 登録処理
    console.log(req.body)
    const insertUser = new InsertUser({ ...req.body })
    debug(insertUser.info)
    const sql = 'INSERT INTO user VALUES(?,?,?,?,?,?);'
    db.query(sql, insertUser.info, (err, result) => {
      if (err) {
        res.status(403).json()
        throw err
      }
      res.status(200).json()
    })
  })

  authRouter.route("/logIn").all((req, res, next) => {
    debug(req.body)
    next()
  }).post(passport.authenticate("local"), (req, res) => {
    if (req.isAuthenticated() && req.user) {
      return res.status(200).json()
    }
    res.status(403).json()
  })

  authRouter.route("/logOut").all((req, res, next) => {
    if (req.isAuthenticated() && req.user) {
      return next()
    }
    res.redirect("/users/login")
  }).get((req, res) => {
    req.logOut();
    res.redirect("/")
  })

  authRouter.route("/admin").post(passport.authenticate("local", {
    failureRedirect: "/admin/login",
    successRedirect: "/admin"
  }))

  authRouter.route("/google").get(passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    session: false
  }))

  authRouter.route("/google/callback").get(passport.authenticate("google", {
    failureRedirect: "/error"
  }), (req, res) => {
    debug(req.user)
    // googleemailがユーザテーブルにあるかクエリする、あればpassport local loginする
    const sql = "SELECT * FROM user WHERE email = ?"
    db.query(sql, [req.user.email], (err, result) => {
      if (err) {
        throw err
      }
      if (!result.length) {
        return res.redirect("/?生年月日と性別入力ページ")// 生年月日と性別入力欄 render
      }
      const [account] = result
      const userData = new User({ email: account.email, role: account.role })
      req.login(userData, () => {
        debug(req.user)
        res.redirect("/")
      })
    })
    // 生年月日性別を選択するページをgooglemailをつかってレンダリング
  })

  return authRouter
}