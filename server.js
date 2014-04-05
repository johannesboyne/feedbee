var c = require('./consumer')
var http = require('http')
var _ = require('highland')
var jade = require('jade')
var fs = require('fs')
var jd = jade.compile(fs.readFileSync('./templates/template.jade'))
var css = require('stylus'), _styl = fs.readFileSync('./templates/style.styl', 'utf-8')
var stylesheet = ''
var cron = require('./cron')

css.render(_styl, { filename: 'style.styl' }, function(err, css){
  if (err) throw err;
  stylesheet = css
});

function shuffle (o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

http.createServer(function (req, res) {
  if (req.url !== '/') return;
  res.writeHead(200, {'Content-Type': 'text/html'});
 
  var _db = c.consume(),
  date = new Date()
  
  _(_db.createValueStream()).toArray(function (xs) {
    res.end(jd({
      css: stylesheet,
      newsfeed: shuffle(xs),
      date: date.getUTCFullYear() + '/' + (date.getMonth()+1) + '/' +  date.getUTCDate()
    }))
  })
}).listen(1337, '127.0.0.1');

