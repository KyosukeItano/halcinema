
module.exports = (req, res, next) => {
    if (req.isAuthenticated() && req.user) {
        return next()
    }
    res.redirect("/users/login")
} 