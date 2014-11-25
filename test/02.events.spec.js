var assert = require('assert');
suite('Events', function() {

  test('Attach event listener + triggering', function(done) {
    var atomus = require('../lib');
    var b = atomus().html('<input type="text" />').ready(function(errors, window) {
      var input = b.$('input');
      input.val('hello world');
      input.on('change', function(event) {
        assert.equal(event.target.value, 'hello world');
        done();
      });
      b.changed(input);
    });
  });

  test('Make sure that there is only one triggering', function(done) {
    var atomus = require('../lib');
    var b = atomus().html('<button>click me</button').ready(function(errors, window) {
      with(this) {
        var counter = 0;
        $('button').on('click', function() {
          counter += 1;
        });
        b.clicked($('button'));
        assert.equal(counter, 1);
        done();
      }
    });
  });

  test('working with radio boxes', function(done) {
    var atomus = require('../lib');
    var b = atomus
    ()
    .html('<form><input type="radio" name="blah" value="a" /><input type="radio" name="blah" value="b" /></form>')
    .ready(function(errors, window) {
      with(this) {
        assert.equal($('input[value="a"]').is(':checked'), false);
        assert.equal($('input[value="b"]').is(':checked'), false);
        $('input[value="a"]').click();
        $('input[value="b"]').click();
        assert.equal($('input[value="a"]').is(':checked'), false);
        assert.equal($('input[value="b"]').is(':checked'), true);
        done();
      }
    });
  });

  test('working with check boxes', function(done) {
    var atomus = require('../lib');
    var b = atomus
    ()
    .html('<form><input type="checkbox" name="blah" value="a" /><input type="checkbox" name="blah" value="b" /></form>')
    .ready(function(errors, window) {
      with(this) {
        assert.equal($('input[value="a"]').is(':checked'), false);
        assert.equal($('input[value="b"]').is(':checked'), false);
        $('input[value="a"]').click();
        $('input[value="b"]').click();
        assert.equal($('input[value="a"]').is(':checked'), true);
        assert.equal($('input[value="b"]').is(':checked'), true);
        done();
      }
    });
  });

});