var assert = require('assert');
suite('Basics', function() {

  test('default options', function(done) {
    var atomus = require('../lib');
    var b = atomus();
    b.ready(function(errors, window) {
      done();
    });
  });

  test('adding initial html', function(done) {
    var atomus = require('../lib');
    var b = atomus().html('<h1>Hello atomus</h1>').ready(function(errors, window) {
      assert.equal(b.$('body').html(), '<h1>Hello atomus</h1>');
      done();
    });
  });

  test('adding external libs', function(done) {
    var atomus = require('../lib');
    var b = atomus().external(__dirname + '/data/library.js').ready(function(errors, window) {
      assert.equal(b.window.AwesomeLibrary.answer(), 42);
      done();
    });
  });

  require('../lib')()
  .html('<section><a href="#" id="link">click me</a></section>')
  .external('vendor/angularjs.min.js')
  .external('src/my-module.js')
  .ready(function(errors, window) {
    var $ = this.$; // jQuery
    $('#link').on('click', function() {
      console.log('link clicked');
    });
    this.clicked($('#link'));
  });

});