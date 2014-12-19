var assert = require('assert');
suite('AngularJS test', function() {

  test('Testing AngularJS directive', function(done) {
    this.timeout(5000);

    var atomus = require('../lib');
    var b = atomus()
    .html('<html><body><div ng-controller="Controller"><register-form></register-form></div></body></html>')
    .external(__dirname + '/data/angular.js')
    .external(__dirname + '/data/angular.register-form.js')
    .ready(function(errors, window) {
      if(errors !== null) console.log(errors);

      var Controller = function($scope) {
        setTimeout(function() {
          runTests();
        }, 300);
      };
      
      var runTests = function() {

        var register = b.$('#register-button');
        var message = b.$('#message');
        var username = b.$('#username');
        var password = b.$('#password');

        b.clicked(register);
        assert.equal(message.text(), 'Missing username.');

        username.val('test');
        b.changed(username);
        b.clicked(register);
        assert.equal(message.text(), 'Missing password.');

        password.val('test');
        b.changed(password);
        b.clicked(register);
        assert.equal(message.text(), 'Too short username.');

        username.val('testtesttesttest');
        b.changed(username);
        b.clicked(register);
        assert.equal(message.text(), 'Too short password.');

        password.val('testtesttesttest');
        b.changed(password);
        b.clicked(register);
        assert.equal(message.text(), '');

        done();

      };

      var app = window
      .angular
      .module('app', [])
      .controller('Controller', Controller)
      .directive('registerForm', window.registerFormDirective);

      window.angular.bootstrap(window.document, ['app']);
    });
  });

});