const mysql = require("mysql")
const debug = require("debug")("app:mysql")

const dbConnect = () => {
  const sql = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  })

  sql.connect((err) => {
    if (err) {
      throw err
    }
    debug("database connected")
  })

  return sql
}


module.exports = dbConnect