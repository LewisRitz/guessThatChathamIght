'use strict';

var stiefelApp = angular.module('stiefelApp', []);

stiefelApp.controller('stiefelAppController', ['$scope', '$http', function($scope, $http) {
	$scope.testStuff = "test yo";
	$scope.showGamePage = true;
	$scope.showHistoryPage = false;

	$scope.navGo = function(goToThisPage) { 
		if(goToThisPage === 'History') {
			$scope.showGamePage = false;
			$scope.showHistoryPage = true;
		} else if(goToThisPage === 'Game') {
			$scope.showGamePage = true;
			$scope.showHistoryPage = false;
		}
	}

}]);