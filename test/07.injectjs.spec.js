var assert = require('assert');
suite('Injecting', function() {

  test('Injecting JavaScript', function(done) {
    var atomus = require('../lib');
    var b = atomus({ injectJS: 'var getTheAnswer = function() { return 42; }' })
    .ready(function(errors, window) {
      assert(window.getTheAnswer() === 42);
      assert(window.$('html')[0].outerHTML.indexOf('<script type=\"text/javascript\">var getTheAnswer = function() { return 42; }</script></head>') > 0);
      done();
    });
  });

  test('Injecting JavaScript with already predefined html', function(done) {
    var atomus = require('../lib');
    var b = atomus({ injectJS: 'var getTheAnswer = function() { return 42; }' })
    .html('<html><head></head><body></body></html>')
    .ready(function(errors, window) {
      assert(window.getTheAnswer() === 42);
      assert(window.$('html')[0].outerHTML.indexOf('<script type=\"text/javascript\">var getTheAnswer = function() { return 42; }</script></head>') > 0);
      done();
    });
  });

  test('Using the API method', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .html('<html><head></head><body></body></html>')
    .injectJS('var getTheAnswer = function() { return 42; }')
    .ready(function(errors, window) {
      assert(window.getTheAnswer() === 42);
      assert(window.$('html')[0].outerHTML.indexOf('<script type=\"text/javascript\">var getTheAnswer = function() { return 42; }</script></head>') > 0);
      done();
    });
  });

  test('Using the API method and change the html', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .injectJS('var getTheAnswer = function() { return 42; }')
    .html('<html><head></head><body></body></html>')
    .ready(function(errors, window) {
      assert(window.getTheAnswer() === 42);
      assert(window.$('html')[0].outerHTML.indexOf('<script type=\"text/javascript\">var getTheAnswer = function() { return 42; }</script></head>') > 0);
      done();
    });
  });

});