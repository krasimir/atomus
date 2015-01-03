var assert = require('assert');
suite('Transferring console.logs', function() {

  var original = console.log;

  test('Keeping the old window.log', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .injectJS('var doSomething = function() { window.log(\'hello\'); };')
    .ready(function(errors, window) {
      var logs = [];
      console.log = function(o) {
        logs.push(o);
      };
      console.log('test');
      assert.deepEqual(logs, ['test'])
      window.doSomething();
      assert.deepEqual(logs, ['test', 'hello'])
      console.log = original;
      done();
    });
  });

  test('Calling console.log', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .injectJS('var doSomething = function() { console.log(\'hello\'); };')
    .ready(function(errors, window) {
      var logs = [];
      console.log = function(o) {
        logs.push(o);
      };
      console.log('test');
      assert.deepEqual(logs, ['test'])
      window.doSomething();
      assert.deepEqual(logs, ['test', 'hello'])
      console.log = original;
      done();
    });
  });

  test('Calling console.log before having a window object', function(done) {
    var logs = [];
    console.log = function(o) {
      logs.push(o);
    };
    var atomus = require('../lib');
    var b = atomus()
    .injectJS('console.log(\'hello\');')
    .ready(function(errors, window) {
      assert.deepEqual(logs, ['hello'])
      console.log = original;
      done();
    });
  });

  test('Make sure that it polyfills all the console methods', function(done) {
    var logs = [];
    console.log = function(o) {
      logs.push(o);
    };
    var atomus = require('../lib');
    var b = atomus()
    .injectJS('console.info(\'hello\');console.group(\'world\');')
    .ready(function(errors, window) {
      assert.deepEqual(logs, ['hello', 'world'])
      console.log = original;
      done();
    });
  });

});