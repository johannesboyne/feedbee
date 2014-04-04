var feedstream = require('./index'),
crypto = require('crypto'),
summaryGen = require('node-summary'),
through = require('through')

exports.consume = function () {
  var consumeStream = through(function write(data) {
    this.emit('data', data)
  })
  
  function readIt (data) {
    //var _id = crypto.createHash('sha1').update(data.item.guid).digest('hex')
    //store[_id] = { title: data.item.title, description: data.item.description }
    //consumeStream.write({ title: data.item.title, description: data.item.description })
    var _desc = data.item.description && data.item.description.length ? data.item.description.substr(0,80) + '...' : data.item.description;
    consumeStream.write('<article><a href="'+data.item.link+'"><h2>' + data.item.title + '</a></h2><p>' + data.meta.title + ' / ' + data.item.author + '</p><p>' + _desc +'</p></article>')
  }
  var _count = 5;
  
  function endIt () {
    _count--;
    if (_count <= 0) consumeStream.end()
  }

  feedstream.newStream('http://www.businessweek.com/feeds/most-popular.rss').on('data', readIt).on('end', endIt)
  feedstream.newStream('http://feeds.inc.com/home/updates').on('data', readIt).on('end', endIt)
  feedstream.newStream('http://feeds.reuters.com/reuters/topNews?format=xml').on('data', readIt).on('end', endIt)
  feedstream.newStream('http://rss1.smashingmagazine.com/feed/').on('data', readIt).on('end', endIt)
  feedstream.newStream('https://news.ycombinator.com/rss').on('data', readIt).on('end', endIt)

  return consumeStream
}
