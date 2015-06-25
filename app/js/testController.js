'use strict';

var chathamApp = angular.module('chathamApp', []);

chathamApp.controller('homePageController', ['$scope', '$http', function($scope, $http) {
	$scope.description = '';

	$scope.profileId = '';
	$scope.wrongNames = [];

	/*  
		These variables are used to control the workflow.  They tell different
		sections of html to appear or hide.  
	*/
	$scope.showListCompleteForm = false;
	$scope.showAnswerResults = false;
	$scope.theyAnsweredCorrect = true;

	/*
		These variables hold statistical data on the current round being played.
	*/
	$scope.numberCorrect = 0;
	$scope.numberTried = 0;

	//$scope.allData = {};

	$scope.activeArrayOfPeople = {};
	$scope.wrongProfileList = {};
	$scope.completeHistoricArrayOfPeople = {};

	$scope.getAllOfTheData = function() {
		$http({
			method: 'GET',
			url: '/getListOfProfiles',
		}).success(function(data, status, headers, config){

			var arrayWithNoMissingImages = [];
			var numberOfIncompleteProfiles = 0;
			for (var i=0; i<data.length; i++){
			//for (var i=0; i<6; i++){			// used for testing
				// we want to exlude profiles with image sources that end with /no_image 
				var regExpression = /^no_image/g;

				// we also only want profiles that have a source image at all, some do not
				if(data[i].PhotoSource){
					// get rid of the file path, we only want the file name
					var PhotoFileName = data[i].PhotoSource.replace(/^.*[\\\/]/, '');
					
					// check the file name against our regular expression
					if(PhotoFileName.match(regExpression)){
						numberOfIncompleteProfiles++;
					} else {
						// include the profile into our game
						arrayWithNoMissingImages.push(data[i]);
					}
				} else {
					// we want to know how many profiles are being skipped, so keep track and log the results later
					numberOfIncompleteProfiles++;
				}
			}
			console.log("found "+numberOfIncompleteProfiles+" incomplete profiles");

			// hide results page, and show the question page
			$scope.showAnswerResults = false;

			// make deep copies of our data
			/**
				We want to remove profiles we have already used to keep the code simple and fast.
				We need to have separate arrays for keeping track of correct profile answers and incorrect
				profile answers.  Both of which will be able to deep copy the 'Historic' array in order
				to get the original data back for the next round.
			**/
			$scope.activeArrayOfPeople = JSON.parse(JSON.stringify(arrayWithNoMissingImages));
			$scope.completeHistoricArrayOfPeople = JSON.parse(JSON.stringify(arrayWithNoMissingImages));
			$scope.wrongProfileList = JSON.parse(JSON.stringify(arrayWithNoMissingImages));

			// begin the game, now that the data has loaded
			$scope.getARandomPerson();
		});
	};

	// get the data from the database.  This is the starting point of the app.
	$scope.getAllOfTheData();


	$scope.getARandomPerson = function() {
		// hide the answers and show the question
		$scope.showAnswerResults = false;

		// clear the relative scope data
		$scope.profileId = "";
		$scope.firstName = "";
		$scope.lastName = "";
		$scope.description = "";
		$scope.wrongNames = [];

		// check if the entire list is complete
		if($scope.activeArrayOfPeople.length === 0){
			console.log("list complete!");
			$scope.showListCompleteForm = true;
		} else {
			var array = $scope.activeArrayOfPeople; // this variable is smaller
			var ProfilePhotoNotFound = true;		// just in case, check for bad data

			var randProf = {};			// we want to get a random profile
			var index = -1;				// the random profile index
			console.log("Question Number: "+($scope.numberTried+1));
			while(ProfilePhotoNotFound){
				var index = Math.floor(Math.random()*array.length);
				randProf = array[index];

				// make sure the source exists and isn't null
				if (randProf.PhotoSource){

					ProfilePhotoNotFound = false;
				}
			}

			// set the new relative scope data
			$scope.profileId = randProf._id;
			$scope.firstName = randProf.FirstName;
			$scope.lastName = randProf.LastName;
			$scope.description = randProf.About;

			// remove the profile from the 'Active People' array
			array.splice(index, 1);

			// get some incorrect names
			getThreeRandomNames();
		}
	};

	var getThreeRandomNames = function(){
		// ensure this is clear
		$scope.wrongNames = [];

		// make a deep copy of the static, 'Historic' data array
		$scope.wrongProfileList = JSON.parse(JSON.stringify($scope.completeHistoricArrayOfPeople));
		
		// loop 3 times
		for (var i=0;i<3; i++){
			var array = $scope.wrongProfileList;	// this array name is smaller

			// local vars
			var duplicateProfileFound = true;		// used to loop util a unique profile is found
			var randProf;							// defined in this scope, the rand profile
			var randomIndex;						// defined in this scope, the index of the profile
			console.log("name: "+$scope.firstName+" "+$scope.lastName);
			while(duplicateProfileFound) {
				// get a random index for our array
				randomIndex = Math.floor(Math.random()*array.length);

				// get the profile for that index
				randProf = array[randomIndex];

				// check to make sure it isn't the correct profile
				if(randProf._id === $scope.profileId){

				} else {
					// remove the item from the wrong answer array
					array.splice(randomIndex, 1);
					// end the while loop (b/c we found a good result)
					duplicateProfileFound = false;
				}
			}
			// add the new profile object to the wrong profile array
			var wrongName = randProf.FirstName+" "+randProf.LastName;
			var wrongId = randProf._id;
			var wrongProfile = { name: wrongName, id: wrongId };
			$scope.wrongNames.push(wrongProfile);
		}
		// add the correct answer to the list of wrong answers
		var rightName = $scope.firstName+" "+$scope.lastName;
		var rightId = $scope.profileId;
		var rightProfile = { name: rightName, id: rightId };
		$scope.wrongNames.push(rightProfile);

		// shuffle the array of possible answers
		$scope.wrongNames = shuffle($scope.wrongNames);
	};

	$scope.restartTheList = function() {
		$scope.showListCompleteForm = false;
		$scope.numberCorrect = 0;
		$scope.numberTried = 0;
		$scope.activeArrayOfPeople = JSON.parse(JSON.stringify($scope.completeHistoricArrayOfPeople));
		$scope.getARandomPerson();

	};

	$scope.checkAnser = function(identifier){
		$scope.showAnswerResults = true;
		$scope.numberTried++;
		if(identifier === $scope.profileId){
			//console.log("You are correct");
			$scope.theyAnsweredCorrect = true;
			$scope.numberCorrect++;
		} else {
			//console.log("NO DOOFUS!");
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
	};



	// 	// $http({
	// 	// 	method: 'POST',
	// 	// 	url: '/CreateProfile',
	// 	// 	params: {
	// 	// 		firstName: $scope.profileFirstName,
	// 	// 		lastName: $scope.profileLastName,
	// 	// 		imageUrl: $scope.profileImagePath,
	// 	// 		description: $scope.profileDescription
	// 	// 	},
	// 	// }).success(function(data, status, headers, config){
	// 	// 	// $scope.status = status;
	// 	// 	// $scope.data = data;
	// 	// });
	// };
}]);