'use strict';

/* Services */

var maseServices = angular.module('maseAppServices', ['ngResource']);

var baseUrl = 'http://localhost:9100';

maseServices.factory('Todo', ['$resource',
  function($resource){
    return $resource(baseUrl + '/mase-web/todos/:id', {id : '@id'},
    	{ 'update': {method: 'PUT'} }
    );
}]);

maseServices.factory('Account', ['$resource',
	function ($resource) {
	    return $resource(baseUrl + '/mase-web/account', {}, {
	    });
	}]);

maseServices.factory('UserService', ['$http',
  function($http) {
	  return {
	  	login: function (param, success, error) {
        var data = "email=" + param.email +"&password=" + param.password;
        var promise = $http.post(baseUrl + '/mase-web/login', data, {
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          }});
        promise.success(function (data, status, headers, config) {
           console.log("login successful !");
           if (success) {
          	 success(data);
           }
        });
        promise.error(function (data, status, headers, config) {
        	console.log("error login !" + status);
        	 if (error) {
          	 error(status);
           }
        });
	  	},

          logout: function(success, error) {
              var promise = $http.get(baseUrl + '/mase-web/logout');
              promise.success(function () {
                  console.log("logout successful !");
                  if (success) {
                      success();
                  }
              });
              promise.error(function () {
                  console.log("logout error!");
                  if (error) {
                      error();
                  }
              });
          }
	  };
}]);
		
maseServices.factory('httpInterceptor', function httpInterceptor ($q, $window, $location) {
  return function (promise) {
      var success = function (response) {
          return response;
      };

      var error = function (response) {
          if (response.status === 401) {
              $location.url('/login');
          }

          return $q.reject(response);
      };

      return promise.then(success, error);
  };
});