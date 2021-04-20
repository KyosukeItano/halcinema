class User {
  constructor({ email, role }) {
    this.email = email
    this.role = role
  }

  setEmail(email) {
    this.email = email
  }
  setRole(role) {
    this.role = role
  }
}

module.exports = User
