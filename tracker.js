class Session {
  constructor({ name = '' + new Date(), start = 0, end = 0 }) {
    var _name = name
    this.getName = function() { return _name; }

    var _startDate = new Date(start)
    this.setStartDate = function(startDate) { _startDate = startDate; }
    this.getStartDate = function() { return _startDate; }

    var _endDate = new Date(end)
    this.setEndDate = function(endDate) { _endDate = endDate; }
    this.getEndDate = function() { return _endDate; }

    var _sessionSaver = new SessionSaver(this)
    this.getSessionSaver = function() { return _sessionSaver; }
  }

  start() {
    var now = new Date()
    this.setStartDate(now)
  }

  stop() {
    var now = new Date()
    this.setEndDate(now)
  }

  save() {
    this.getSessionSaver().save()
  }

  serialize() {
    return {
      name: this.getName(),
      start: this.getStartDate(),
      end: this.getEndDate()
    }
  }

  length() {
    return this.getEndDate() - this.getStartDate()
  }
}

class SessionSaver {
  constructor(session) {
    var _session = session
    this.getSession = function() { return _session; }

    var _storage = new Storage()
    this.getStorage = function() { return _storage; }
  }

  save() {
    var sessions = this.getStorage().getSessions()
    var name = this.getSession().getName()
    sessions[name] = this.getSession().serialize()
    this.getStorage().setSessions(sessions)
  }
}

class Storage {
  constructor() {
    this.STORAGE_KEY = 'TRACKER_SESSIONS'
  }

  getSessions() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {}
  }

  setSessions(sessions) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions))
  }

  removeSessions() {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}

class Overview {
  constructor(session) {
    var _storage = new Storage()
    this.getStorage = function() { return _storage; }

    this.TODAY_BEGIN = this.getToday()
    this.WEEK_BEGIN = this.getLastMonday()
    this.MONTH_BEGIN = this.getFirstDayOfMonth()
    this.SAMPLE_LENGTH = 3
  }

  get() {
    var sessions = this.getStorage().getSessions()

    return {
      // Order is important because old sessions are being deleted
      month: this.getOverviewSinceDate(sessions, this.MONTH_BEGIN),
      week: this.getOverviewSinceDate(sessions, this.WEEK_BEGIN),
      day: this.getOverviewSinceDate(sessions, this.TODAY_BEGIN),
    }
  }

  getOverviewSinceDate(sessions, sinceDate) {
    sessions = this.getSessionsSinceDate(sessions, sinceDate)

    return this.getSessionsOverview(sessions)
  }

  getSessionsSinceDate(sessions, sinceDate) {
    for (var key in sessions)
      if (sessions.hasOwnProperty(key))
        if (sinceDate > new Date(sessions[key]['start']))
          delete sessions[key]

    return sessions
  }

  getSessionsOverview(sessions) {
    var overview = {
      count: 0,
      maxLength: 0,
      minLength: Number.MAX_SAFE_INTEGER,
      sample: [],
    }

    for (var key in sessions) {
      var session = new Session(sessions[key])
      overview.count++
      overview.maxLength = Math.max(overview.maxLength, session.length())
      overview.minLength = Math.min(overview.minLength, session.length())
      if (overview.sample.length < 3)
        overview.sample.push(session)
    }

    return overview
  }

  getToday() {
    var today = new Date()
    today.setHours(0,0,0,0)

    return today
  }

  getLastMonday() {
    var date = new Date()
    date.setHours(0,0,0,0)

    var currentDay = date.getDay()
    if (currentDay == 0) {
      // It's Sunday so we need to change the week
      date.setDate(date.getDate() - 7)
    }
    var monday = 1
    var distance = monday - currentDay
    date.setDate(date.getDate() + distance)

    return date
  }

  getFirstDayOfMonth() {
    var date = new Date()
    date.setHours(0,0,0,0)
    date.setDate(1)

    return date
  }
}
