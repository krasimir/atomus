var assert = require('assert');
suite('Basics', function() {

  test('default options', function(done) {
    var atomus = require('../lib');
    var b = atomus.browser();
    b.ready(function(errors, window) {
      done();
    });
  });

  test('adding initial html', function(done) {
    var atomus = require('../lib');
    var b = atomus.browser().html('<h1>Hello atomus</h1>').ready(function(errors, window) {
      assert.equal(b.$('body').innerHTML, '<h1>Hello atomus</h1>');
      done();
    });
  });

  test('adding external libs', function(done) {
    var atomus = require('../lib');
    var b = atomus.browser().external(__dirname + '/data/library.js').ready(function(errors, window) {
      assert.equal(b.window.AwesomeLibrary.answer(), 42);
      done();
    });
  });

});