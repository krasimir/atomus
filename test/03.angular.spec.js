var assert = require('assert');
suite('AngularJS test', function() {

  test('Testing AngularJS directive', function(done) {
    this.timeout(3000);

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

          register.click();
          assert.equal(message.innerHTML, 'Missing username.');

          username.value = 'test';
          b.trigger(username, 'change');
          register.click();
          assert.equal(message.innerHTML, 'Missing password.');

          password.value = 'test';
          b.trigger(password, 'change');
          register.click();
          assert.equal(message.innerHTML, 'Too short username.');

          username.value = 'testtesttesttest';
          b.trigger(username, 'change');
          register.click();
          assert.equal(message.innerHTML, 'Too short password.');

          password.value = 'testtesttesttest';
          b.trigger(password, 'change');
          register.click();
          assert.equal(message.innerHTML, '');

          done();

        };
        setTimeout(runTests, 1000);
      }

      window
        .angular
        .module('app', [])
        .controller('Controller', Controller)
        .directive('registerForm', window.registerFormDirective);

    });
  });

});