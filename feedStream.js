var FeedParser = require('feedparser'),
request = require('request'),
through = require('through')

exports.newStream = function (url) {
  var req = request(url),
  feedparser = new FeedParser(),
  ts = through(function write(data) {
    this.emit('data', data)
  })
  
  req.on('error', function (error) {
    // handle any request errors
  })
  req.on('response', function (res) {
    var stream = this
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'))
    stream.pipe(feedparser)
  })
  
  feedparser.on('error', function(error) {/* always handle errors*/});
  feedparser.on('readable', function() {
    // This is where the action is!
    var stream = this,
    meta = this.meta,
    item

    while ((item = stream.read())) {
      ts.write({meta: meta, item: item})
    }
  })
  feedparser.on('end', ts.end)

  return ts;
}

