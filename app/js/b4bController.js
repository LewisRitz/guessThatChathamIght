'use strict';

var b4bApp = angular.module('b4bApp', []);

b4bApp.controller('b4bController', ['$scope', '$http', function($scope, $http) {
	$scope.description = 'test';
	$scope.currentMainPage = 'FallBikeEvent';//'aboutUsPage';

	$scope.changePageTo = function(thePage) {
		$scope.currentMainPage = thePage;
	};

	$scope.showThisPage = function(thePage) {
		if($scope.currentMainPage === thePage){
			return true;
		} else { return false; }
	};

	$scope.hideThisPage = function(thePage) {
		if($scope.currentMainPage === thePage){
			return false;
		} else { return true; }
	};

	$scope.showHide = function(showId, hideId) {
		document.getElementById(showId).style.display = 'block';
		document.getElementById(hideId).style.display = 'none';
	};


}]);