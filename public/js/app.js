$(document).ready(function () {

  // confirmations
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });
});

    
angular.module('Stallket.Signup', ['ui', 'restangular', 'ngRoute']).
  config(function($routeProvider, RestangularProvider) {
    // $routeProvider.
    //   when('/', {
    //     controller:ListCtrl, 
    //     templateUrl:'list.html'
    //   }).
    //   when('/edit/:projectId', {
    //     controller:EditCtrl, 
    //     templateUrl:'detail.html',
    //     resolve: {
    //       project: function(Restangular, $route){
    //         return Restangular.one('projects', $route.current.params.projectId).get();
    //       }
    //     }
    //   }).
    //   when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    //   otherwise({redirectTo:'/'});
      
      RestangularProvider.setBaseUrl('http://localhost:3000');

      RestangularProvider.setResponseExtractor(function(response, operation) {
        return response;
      });

      // RestangularProvider.setDefaultRequestParams({ apiKey: '4f847ad3e4b08a2eed5f3b54' })
      // RestangularProvider.setRestangularFields({
      //   id: '_id.$oid'
      // });
      
      // RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
      //   if (operation === 'put') {
      //     elem._id = undefined;
      //     return elem;
      //   }
      //   return elem;
      // })
  });


function SignupCtrl($scope, Restangular) {
  var baseUsers = Restangular.all('users');
  $scope.alerts = [];
  $scope.step = 1;

  $scope.create = function() {
    $scope.alerts = [];

    //sign up the form when it is valid
    if ($scope.form.$valid) {

      //post to api and create new user
      baseUsers.post(angular.toJson($scope.user())).
        then(function(result) {
          if (result.errors === undefined) {
            $scope.step = 2;
          } else if (result.errors.email !== undefined){
             $scope.pushAlert(result.errors.email.message);
          }
        }, function() {
          console.log('There was an error saving');
        });

    } else {
      $scope.pushAlert('請確定已塡寫所有資料');
      //show error message
    }
  }

  $scope.user = function() {

    //convert form to json
    var newUser = {
      email: $scope.email,
      hashed_password: $scope.password
    };

    return newUser;
  }

  $scope.pushAlert = function(message) {
    $scope.alerts.push({msg: message});
  }
}