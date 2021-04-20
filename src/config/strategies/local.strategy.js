const passport = require("passport")
const { Strategy } = require("passport-local")
const db = require("../mysql")()
const debug = require("debug")("app:localStrategy")
const User = require("../../models/User")

const localStrategy = () => {
  passport.use(new Strategy({
    usernameField: "username",
    passwordField: "password"
  }, (username, password, done) => {
    (async function () {
      const sql = "SELECT * FROM user WHERE email = ? AND pass = ?;"
      if (!db) {
        const dummy = new User({ email: "adminGuest@mail.com", role: "admin" })
        return done(null, dummy)
      }
      db.query(sql, [username, password], (err, result) => {
        if (err) {
          debug(err)
        }
        debug(result)
        if (!result.length) return done(null, false)
        const [account] = result
        const userData = new User({ email: account.email, role: account.role })
        done(null, userData)
      })
    }())
  }))
}

module.exports = localStrategy
