var assert = require('assert');
suite('Local storage', function() {

  test('Creating a component', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .html('<body><main></main></body>')
    .ready(function(errors, window) {
      assert(!!window.localStorage);
      window.localStorage.setItem('foo', 42);
      assert.deepEqual(window.localStorage.getItem('foo'), 42);
      done();
    });
  });

});