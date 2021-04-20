class InsertUser {
  constructor({ email, password, gender, birth }) {
    const now = new Date().toLocaleDateString()
    this.info = [email, password, gender, birth, now, "user"]
  }
}

module.exports = InsertUser