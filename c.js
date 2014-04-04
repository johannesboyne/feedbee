var c = require('./r')
var http = require('http')
var _ = require('highland')

function shuffle (o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html>')
  res.write('<head>')
  res.write('<title>Feed Bee</title>')
  res.write('<meta charset="utf-8">')
  res.write('<style>body { font-family: "HelveticaNeue-Light", Helvetica, Arial, sans-serif; }</style></head><body>')
  _(c.consume()).toArray(function (xs) {
    shuffle(xs).forEach(function (x) {
      res.write(x)
    })
    res.end();
  })
}).listen(1337, '127.0.0.1');

