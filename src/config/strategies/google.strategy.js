const passport = require("passport")
const Strategy = require("passport-google-oauth").OAuth2Strategy
const User = require("../../models/User")
const debug = require("debug")("app:googleStrategy")

const GoogleStrategy = () => {
  debug(process.env.GOOGLE_ID)
  passport.use(new Strategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SE,
    callbackURL: `/auth/google/callback`
  }, (accessToken, refreshToken, profile, done) => {
    const userData = new User({ email: profile.emails[0].value, role: "user" })
    done(null, userData)
  }))

}

module.exports = GoogleStrategy
