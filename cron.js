var feedstream = require('./feedStream'),
crypto = require('crypto'),
through = require('through'),
consumer = require('./consumer').consume()

function write (data) {
  var regex = /(<([^>]+)>)/ig
  var _desc = data.item.description && data.item.description.length ? data.item.description.replace(regex, "") : ''
  _desc = _desc.substr(0,160) + '...'
  this.emit('data', {
    key: crypto.createHash('sha1').update('' + data.item.title + data.item.link).digest('hex'),
    value: {
      link: data.item.link,
      title: data.item.title.replace(regex, ""),
      source: data.meta.title,
      author: data.item.author,
      description: _desc
    }
  })
}

function collectData () {
  feedstream.newStream('http://www.forbes.com/feeds/popstories.xml').pipe(through(write)).pipe(consumer.createWriteStream())
  .on('close', function () {
    feedstream.newStream('http://feeds.reuters.com/reuters/topNews?format=xml').pipe(through(write)).pipe(consumer.createWriteStream())
    .on('close', function () {
      feedstream.newStream('http://feeds.bbci.co.uk/news/rss.xml').pipe(through(write)).pipe(consumer.createWriteStream())
    })
  })
}

collectData()
setInterval(collectData, 1000*60*10)
