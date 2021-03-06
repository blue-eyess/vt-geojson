require('phantomjs-polyfill')
var fs = require('fs')
var test = require('tap').test
var cover = require('../lib/cover')
var vtgj = require('../')

var GeojsonEquality = require('geojson-equality')
var eq = new GeojsonEquality({ precision: 5 })

test('basic', function (t) {
  var tileUri = 'mbtiles://' + __dirname + '/data/test.mbtiles'
  var original = fs.readFileSync(__dirname + '/data/original.geojson')
  original = JSON.parse(original)
  var expected = fs.readFileSync(__dirname + '/data/expected-z13.geojson')
  expected = JSON.parse(expected).features

  var limits = {
    min_zoom: 13,
    max_zoom: 13
  }

  t.plan(expected.length * 2)

  var tiles = cover(original, limits)
  vtgj(tileUri, { tiles: tiles })
  .on('data', function (data) {
    var exp = expected.shift()
    t.ok(eq.compare(data.geometry, exp.geometry))
    t.deepEqual(exp.properties, data.properties)
  })
})

