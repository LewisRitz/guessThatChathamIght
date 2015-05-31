'use strict';

var chathamApp = angular.module('chathamApp', []);

chathamApp.controller('homePageController', ['$scope', '$http', function($scope, $http) {
	$scope.testValue = 'the test works!';
	$scope.firstName = 'Michael';
	$scope.lastName = 'Bontrager';
	$scope.description = '';
	$scope.image = '';
	$scope.image2 = $scope.firstName+' '+$scope.lastName;
	$scope.profileId = '';
	$scope.wrongNames = [];
	$scope.showListCompleteForm = false;
	$scope.showAnswerResults = false;
	$scope.theyAnsweredCorrect = true;
	$scope.numberCorrect = 0;
	$scope.numberTried = 0;

	$scope.restartTheList = function() {
		$scope.getANewPerson();
		$scope.showListCompleteForm = false;
	};

	$scope.checkAnser = function(identifier){
		$scope.showAnswerResults = true;
		$scope.numberTried++;
		if(identifier === $scope.profileId){
			console.log("You are correct");
			$scope.theyAnsweredCorrect = true;
			$scope.numberCorrect++;
		} else {
			console.log("NO DOOFUS!");
			$scope.theyAnsweredCorrect = false;

		}
		//console.log("id: "+identifier);
	};

	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex ;
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}

	$scope.getRandomNames = function() {
		$http({
			method: 'GET',
			url: '/getThreeRandomNames',
		}).success(function(data, status, headers, config){
			$scope.wrongNames = [];
			for(var i=0;i<data.length;i++){
				var UserObject = { id: data[i]._id, Name: data[i].FirstName+' '+data[i].LastName }
				//console.log(JSON.stringify(UserObject));
				$scope.wrongNames.push(UserObject);
				//$scope.wrongNames.push(data[i].FirstName+' '+data[i].LastName);
			}
			var RightUserObject = { id: $scope.profileId, Name: $scope.firstName+' '+$scope.lastName }
			$scope.wrongNames.push(RightUserObject);
			//$scope.wrongNames.push($scope.firstName+' '+$scope.lastName);
			shuffle($scope.wrongNames);
			console.log('names: '+JSON.stringify($scope.wrongNames));
			$scope.showAnswerResults = false;
		});
		// $http({
		// 	method: 'GET',
		// 	url: '/getARandomWrongName',
		// }).success(function(data, status, headers, config){
		// 	$scope.wrongNames = [];
		// 	$scope.wrongNames.push(data.FirstName+' '+data.LastName);
		// 	console.log('wrong name: '+JSON.stringify($scope.wrongNames));
		// 	setTimeout(function(){
		// 		$http({
		// 			method: 'GET',
		// 			url: '/getARandomWrongName',
		// 		}).success(function(data, status, headers, config){
		// 			$scope.wrongNames = [];
		// 			$scope.wrongNames.push(data.FirstName+' '+data.LastName);
		// 			console.log('wrong name: '+JSON.stringify($scope.wrongNames));
		// 			setTimeout(function(){
		// 				$http({
		// 					method: 'GET',
		// 					url: '/getARandomWrongName',
		// 				}).success(function(data, status, headers, config){
		// 					$scope.wrongNames = [];
		// 					$scope.wrongNames.push(data.FirstName+' '+data.LastName);
		// 					console.log('wrong name: '+JSON.stringify($scope.wrongNames));
		// 				}, 6000);
		// 			});
		// 		});
		// 	}, 3000);
		// });
	};

	$scope.getANewPerson = function() {
		$http({
			method: 'GET',
			url: '/randomProfile'
		}).success(function(data, status, headers, config){
			//console.log(data);
			if (status === 203) { 
				console.log("list complete!!"); 
				$scope.showListCompleteForm = true;
			} else {
				console.log(data.FirstName+' '+data.LastName);
				$scope.firstName = data.FirstName;
				$scope.lastName = data.LastName;
				$scope.description = data.About;
				$scope.image = data.PhotoUrl;
				$scope.profileId = data._id;
				$scope.getRandomNames();
			}
		});
	};

	$scope.getANewPerson(); // Execute on page load

	$scope.createANewProfile = function(){
		console.log("button works "+$scope.profileFirstName);


		// $http({
		// 	method: 'POST',
		// 	url: '/CreateProfile',
		// 	params: {
		// 		firstName: $scope.profileFirstName,
		// 		lastName: $scope.profileLastName,
		// 		imageUrl: $scope.profileImagePath,
		// 		description: $scope.profileDescription
		// 	},
		// }).success(function(data, status, headers, config){
		// 	// $scope.status = status;
		// 	// $scope.data = data;
		// });
	};
}]);