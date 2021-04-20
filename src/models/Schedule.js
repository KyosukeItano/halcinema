class Schedule {

  constructor(payload) {
    this.schedule = [[], [], [], [], [], [], [], []]
    if (payload.length) {
      for (let i = 0; i < payload.length; i++) {
        this.schedule[payload[i].screen - 1] = [...this.schedule[payload[i].screen - 1], payload[i]]
      }
    }
  }

}

module.exports = Schedule