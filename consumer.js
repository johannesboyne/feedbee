var levelup = require('levelup'),
db = levelup('./feed_db', { valueEncoding : 'json' })

exports.consume = function () {
  return db
}
