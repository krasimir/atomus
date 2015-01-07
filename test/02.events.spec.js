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
    var b = atomus()
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
    var b = atomus()
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

  test('working with changeValueOf (input field)', function(done) {
    var atomus = require('../lib'), count = 0;
    var b = atomus()
    .html('<form><input type="text" /></form>')
    .ready(function(errors, window) {
      b.$('input').on('change', function() {
        if(count === 0) {
          assert(b.$(this).val(), 'it works');
          count += 1;
        } else {
          assert(b.$(this).val(), 'it works again');
          done();
        }        
      });
      b
      .changeValueOf(b.$('input'), 'it works')
      .changeValueOf(b.window.document.querySelector('input'), 'it works again');
    });
  });

  test('working with changeValueOf (textarea field)', function(done) {
    var atomus = require('../lib'), count = 0;
    var b = atomus()
    .html('<form><textarea></textarea></form>')
    .ready(function(errors, window) {
      b.$('textarea').on('change', function() {
        if(count === 0) {
          assert(b.$(this).val(), 'it works');
          count += 1;
        } else {
          assert(b.$(this).val(), 'it works again');
          done();
        }        
      });
      b
      .changeValueOf(b.$('textarea'), 'it works')
      .changeValueOf(b.window.document.querySelector('textarea'), 'it works again');
    });
  });

  test('working with changeValueOf (dropdown field)', function(done) {
    var atomus = require('../lib'), count = 0;
    var b = atomus()
    .html('<form><select><option value="ddd">default</option><option value="a">AAA</option><option value="b">BBB</option></select></form>')
    .ready(function(errors, window) {
      b.$('select').on('change', function() {
        if(count === 0) {
          assert(b.$(this).val(), 'a');
          assert(b.window.document.querySelector('select').selectedIndex, 1);
          count += 1;
        } else {
          assert(b.$(this).val(), 'b');
          assert(b.window.document.querySelector('select').selectedIndex, 2);
          done();
        }        
      });
      b
      .changeValueOf(b.$('select'), 'a')
      .changeValueOf(b.window.document.querySelector('select'), 'b');
    });
  });

  test('triggering keypress with particular keyCode', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .html('<form><input type="button" /></form>')
    .ready(function(errors, window) {
      b.$('input').on('keypress', function(e) {
        assert(e.keyCode, 13);
        done();       
      });
      b.keypressed(b.$('input'), 13); // enter key
    });
  });

  test('triggering keypress with particular keyCode (addEventListener)', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .html('<form><input type="button" /></form>')
    .ready(function(errors, window) {
      window.document.querySelector('input').addEventListener('keypress', function(e) {
        done();
      });
      b.keypressed(b.$('input'), 13); // enter key
    });
  });

  test('triggering whatever event with particular keyCode', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .html('<form><input type="button" /></form>')
    .ready(function(errors, window) {
      window.document.querySelector('input').addEventListener('keydown', function(e) {
        done();
      });
      b.triggerEvent(b.$('input'), 'keydown', 13); // enter key
    });
  });

});