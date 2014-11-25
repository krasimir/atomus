var assert = require('assert');
suite('Ractivejs', function() {

  test('Creating a component', function(done) {
    var atomus = require('../lib');
    var b = atomus()
    .html('<body><main></main></body>')
    .external(__dirname + '/data/ractive.js')
    .ready(function(errors, window) {
      var Ractive = window.Ractive.extend({
        el: 'main',
        data: {
          value: null
        },
        template: '\
          <input type="checkbox" checked="{{value}}" />\
        ',
        onrender: function() {
          this.observe('value', function(v) { 
            assert.equal(b.$('input').is(':checked'), true);
            assert.equal(this.get('value'), true);
            done();
          }, { init: false });
        }
      });
      var r = new Ractive();
      this.selected(this.$('input'));
      r.updateModel();
    });
  });

});