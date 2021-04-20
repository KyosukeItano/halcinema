const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const debug = require("debug")("app")
const chalk = require("chalk")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "client"))
app.use("/", express.static(path.join(__dirname, "static")))
app.use("/uploaded", express.static(path.join(__dirname, "uploaded")))
app.use("/js", express.static(path.join(__dirname, "node_modules", "axios", "dist")))
app.use("/js", express.static(path.join(__dirname, "node_modules", "jquery", "dist")))
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
    secret: "halcinema",
    resave: false,
    saveUninitialized: true
}))
require("express-ws")(app)
require("./src/config/passport")(app)

app.get("/", (req, res) => {
    res.render("user/index")
})

// routing setup
const apiRouter = require("./src/routes/apiRoutes")()
const authRouter = require("./src/routes/authRoutes")()
const adminRouter = require("./src/routes/adminRoutes")()
const homeRouter = require("./src/routes/user/homeRouter")()
const productionRouter = require("./src/routes/user/productionRoutes")()
const usersRouter = require("./src/routes/user/usersRoutes")()
const reserveRouter = require("./src/routes/user/reserveRoutes")()


app.use("/api", apiRouter)
app.use("/auth", authRouter)
app.use("/admin", (req, res, next) => {
    // return next()
    debug("originalURL", req._parsedUrl.pathname)
    if (req._parsedUrl.pathname === "/admin/login") {
        return next()
    }
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next()
    }
    res.redirect("/admin/login")
}, adminRouter)
app.use("/home", homeRouter)
app.use("/production", productionRouter)
app.use("/users", usersRouter)
app.use("/reserve", reserveRouter)

app.listen(PORT, () => {
    debug(`server listen on ${chalk.yellow(PORT)} PORT.
    http://localhost:${PORT}`)
})