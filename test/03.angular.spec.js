var assert = require('assert');
suite('AngularJS test', function() {

  test('Testing AngularJS directive', function(done) {
    this.timeout(5000);

    var atomus = require('../lib');
    var b = atomus
    .browser()
    .html('<html ng-app="app"><body><div ng-controller="Controller"><register-form></register-form></div></body></html>')
    .external(__dirname + '/data/angular.min.js')
    .external(__dirname + '/data/register-form.js')
    .ready(function(errors, window) {
      
      var Controller = function($scope) {
        var runTests = function() {

          var register = b.$('#register-button');
          var message = b.$('#message');
          var username = b.$('#username');
          var password = b.$('#password');

          b.trigger(register, 'click');
          assert.equal(message.text(), 'Missing username.');

          username.val('test');
          b.trigger(username, 'change');
          b.trigger(register, 'click');
          assert.equal(message.text(), 'Missing password.');

          password.val('test');
          b.trigger(password, 'change');
          b.trigger(register, 'click');
          assert.equal(message.text(), 'Too short username.');

          username.val('testtesttesttest');
          b.trigger(username, 'change');
          b.trigger(register, 'click');
          assert.equal(message.text(), 'Too short password.');

          password.val('testtesttesttest');
          b.trigger(password, 'change');
          b.trigger(register, 'click');
          assert.equal(message.text(), '');

          done();

        };
        setTimeout(runTests, 1000);
      }

      console.log(b.$('html')[0].outerHTML);

      window
        .angular
        .module('app', [])
        .controller('Controller', Controller)
        .directive('registerForm', window.registerFormDirective);

    });
  });

});