var assert = require('assert');
suite('Events', function() {

  test('Attach event listener + triggering', function(done) {
    var atomus = require('../lib');
    var b = atomus.browser({
      html: '<input type="text" />'
    });
    b.ready(function(errors, window) {
      var input = b.$('input');
      input.value = 'hello world';
      b.on('change', function(event) {
        assert.equal(event.target.value, 'hello world');
        done();
      });
      b.trigger(input, 'change');
    });
  });

});