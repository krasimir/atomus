registerFormDirective = function() {
  return {
    restrict: 'E',
    template: '\
      <form>\
        <p>Please fill the form below</p>\
        <label for="username">Your name</label>\
        <input type="text" name="username" id="username" ng-model="username" />\
        <label for="username">Password</label>\
        <input type="password" name="password" id="password" ng-model="password"/>\
        <br />\
        <input type="button" value="register" ng-click="register()" id="register-button" />\
        <br />\
        <span id="message">{{message}}</span>\
      </form>\
    ',
    controller: function($scope) {      
      var validateInput = function() {
        var u = $scope.username;
        var p = $scope.password;
        if (u === '' || u === undefined) {
          return { status: false, message: 'Missing username.'}
        } else if (p === '' || p === undefined) {
          return { status: false, message: 'Missing password.'}
        } else if (u.length < 10) {
          return { status: false, message: 'Too short username.'}
        } else if (p.length < 6) {
          return { status: false, message: 'Too short password.'}
        }
        return { status: true }
      }
      $scope.register = function() {
        var isValid = validateInput();
        if(false === isValid.status) {
          $scope.message = isValid.message;
          return;
        } else {
          $scope.message = '';
        }
      }
    }
  }
};