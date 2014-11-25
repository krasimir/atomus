var assert = require('assert');
suite('XMLHTTPRequest', function() {

  test('making HTTP request', function(done) {
    this.timeout(5000);
    var atomus = require('../lib');
    var b = atomus()
    .external(__dirname + '/data/ajaxwrapper.js')
    .ready(function(errors, window) {
      window.AjaxWrapper().request({
        url: __dirname + '/../package.json',
        json: true
      }).done(function(result) {
        assert.equal('jsdom' in result.dependencies, true);
        done();
      }).fail(function() {
        assert.equal('HTTP request failed', false);
        done();
      });
    });
  });

});