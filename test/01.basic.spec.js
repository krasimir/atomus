var assert = require('assert'),
  path = require('path');
suite('Basics', function () {

  test('default options', function (done) {
    var atomus = require('../lib');
    var b = atomus();
    b.ready(function (errors, window) {
      done();
    });
  });

  test('adding initial html', function (done) {
    var atomus = require('../lib');
    var b = atomus().html('<h1>Hello atomus</h1>').ready(function (errors, window) {
      assert.equal(b.$('body').html(), '<h1>Hello atomus</h1><script class="jsdom" src="' + path.resolve(__dirname + '/../lib/polyfills/localStorage.js') + '"></script><script class="jsdom" src="' + path.resolve(__dirname + '/../lib/vendor/jquery-1.11.1.min.js') + '"></script>');
      done();
    });
  });

  test('adding external libs', function (done) {
    var atomus = require('../lib');
    var b = atomus().external(__dirname + '/data/library.js').ready(function (errors, window) {
      assert.equal(b.window.AwesomeLibrary.answer(), 42);
      done();
    });
  });

  test('testing waitUntil', function (done) {
    var atomus = require('../lib');
    var b = atomus().html('<body></body>').ready(function (errors, window) {
      b.waitUntil('#awesome', function ($el) {
        done();
      });
      setTimeout(function () {
        b.$('body').html('<div id="awesome"></div>');
      }, 110);
    });
  });

  test('testing waitUntil with promise interface', function (done) {
    var atomus = require('../lib');
    var b = atomus().html('<body></body>').ready(function (errors, window) {
      b.waitUntil('#awesome').then(function (el) {
        assert.equal(this.$('body') instanceof b.window.jQuery, true);
        assert.equal(el.attr('id'), 'awesome');
        done();
      });
      setTimeout(function () {
        b.$('body').html('<div id="awesome"></div>');
      }, 110);
    });
  });

});
