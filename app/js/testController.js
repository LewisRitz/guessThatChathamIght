'use strict';

var chathamApp = angular.module('chathamApp', []);

chathamApp.controller('homePageController', ['$scope', '$http', function($scope, $http) {
	$scope.cards = [];
	$scope.currentName = "";
	$scope.possibleNames = [];

	// var cardExample = {
	// 	imageOfCorrectPerson = 'img/someone.jpeg',
	// 	Names = [{
	// 		name 	: 'name1',
	// 		correct : false
	// 	},{
	// 		name 	: 'name2',
	// 		correct : true
	// 	},{
	// 		name 	: 'name3',
	// 		correct : false
	// 	},{
	// 		name 	: 'name4',
	// 		correct : false
	// 	}]
	// };

	// var NameModel = {
	// 	correctPersonImage  :  		String,
	// 	correctNameIndex	: 		int,
	// 	names 				:  		[]
	// };
	var listOfProfiles = [];
	var NameModel = {};

	// {"_id":"5585ee9b6f8b850c482465a3",
	// "FirstName":"Karolina",
	// "LastName":"Windys",
	// "About":"Karolina works in Chatham’s Hedge Advisory group in an ISDA/Financial Contract Specialist role focusing on legal and derivative documentation. Prior to joining Chatham, she worked as a European Law Expert at the Polish Ministry of Health. Karolina holds a law degree from the University of Wroclaw and an LLM in Corporate and Financial Law from the University of Glasgow. As a participant of the student exchange program she also studied law at the University of Salzburg. \r\n",
	// "PhotoUrl":"Karolina Windys/whoAreThey.jpg",
	// "PhotoSource":"http://www.chathamfinancial.com/wp-content/uploads/2014/05/Windys_Karolina.jpg",
	// "randomNumb":186.6763137979433,"__v":0}

	var  getListOfPeople = function() {
		//console.log("ere1");
		$http({
			method: 'GET',
			url: '/getListOfProfiles',
		}).success(function(data, status, headers, config){

			console.log("here2");
			// This helps filter bad data
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

			// copy the new array ( may be optional )
			listOfProfiles = arrayWithNoMissingImages.slice();

			shuffleList();

			createNameModels();

			$scope.getNextCard();

			// shuffle the new array
			// for (var i=1; i<arrayWithNoMissingImages.length; i++) {
			// 	var swapIndex = Math.floor(Math.random() * i);

			// 	var currentElement = listOfProfiles[i];
			// 	listOfProfiles[i] = listOfProfiles[swapIndex];
			// 	listOfProfiles[swapIndex] = currentElement;
			// };

			// for (var i=arrayWithNoMissingImages.length; i>1; i--){
			// 	var swapIndex = Math.floor(Math.random() * i);

			// 	var currentElement = listOfProfiles[i];
			// 	listOfProfiles[i] = listOfProfiles[swapIndex];
			// 	listOfProfiles[swapIndex] = currentElement;
			// };

			//console.log('list of profiles: '+JSON.stringify(listOfProfiles[1]));
			//console.log('arrayWithNoMissingImages: '+JSON.stringify(arrayWithNoMissingImages[1]));


			// console.log("found "+numberOfIncompleteProfiles+" incomplete profiles");

			// hide results page, and show the question page
			// $scope.showAnswerResults = false;

			// make deep copies of our data
			/**
				We want to remove profiles we have already used to keep the code simple and fast.
				We need to have separate arrays for keeping track of correct profile answers and incorrect
				profile answers.  Both of which will be able to deep copy the 'Historic' array in order
				to get the original data back for the next round.
			**/
			// $scope.activeArrayOfPeople = JSON.parse(JSON.stringify(arrayWithNoMissingImages));
			// $scope.completeHistoricArrayOfPeople = JSON.parse(JSON.stringify(arrayWithNoMissingImages));
			// $scope.wrongProfileList = JSON.parse(JSON.stringify(arrayWithNoMissingImages));

			// begin the game, now that the data has loaded
			// $scope.getARandomPerson();





		});
	};

	getListOfPeople();

	var shuffleList = function() {
		// do stuff
		for (var i=1; i<listOfProfiles.length; i++) {
			var swapIndex = Math.floor(Math.random() * i);

			var currentElement = listOfProfiles[i];
			listOfProfiles[i] = listOfProfiles[swapIndex];
			listOfProfiles[swapIndex] = currentElement;
		};

		for (var i=listOfProfiles.length; i>1; i--){
			var swapIndex = Math.floor(Math.random() * i);

			var currentElement = listOfProfiles[i];
			listOfProfiles[i] = listOfProfiles[swapIndex];
			listOfProfiles[swapIndex] = currentElement;
		};
	};

	var createNameModels = function() {
		// for each element, get 3 wrong names and create a model from them all
		for (var i=0; i<listOfProfiles.length; i++) {
			var correctIndex = Math.floor(Math.random() * 4);
			var nameChoices = [];
			console.log('card: '+JSON.stringify(listOfProfiles[i]));
			console.log('i: '+i);

			// get 3 other names at a scrambled index
			// for (var x=0; x<4; x++) {
			// 	if( x===correctIndex ) {
			// 		nameChoices[x].prototype.firstName = 	listOfProfiles[i].FirstName;
			// 		nameChoices[x].prototype.lastName =  	listOfProfiles[i].LastName;
			// 		// nameChoices[x].description = 	listOfProfiles[i].About;
			// 		// nameChoices[x].identifier = 	listOfProfiles[i]._id;


			// 	} else {
			// 		var randomWrongIndex = Math.floor(Math.random() * listOfProfiles.length);
			// 		if( randomWrongIndex === correctIndex ) { // super rare
			// 			if( correctIndex === 0 ) { correctIndex++; }
			// 			else { correctIndex--; }
			// 		}
			// 		nameChoices[x].prototype.firstName = 	listOfProfiles[randomWrongIndex].FirstName;
			// 		nameChoices[x].prototype.lastName = 	listOfProfiles[randomWrongIndex].LastName;
			// 		// nameChoices[x].description = 	listOfProfiles[randomWrongIndex].About;
			// 		// nameChoices[x].identifier = 	listOfProfiles[randomWrongIndex]._id;
			// 	}
			// }
			var cardModel = {};
			//$scope.cards[i] = {};
			cardModel.names = nameChoices.splice();
			cardModel.correctNameIndex = correctIndex;
			cardModel.identifier = listOfProfiles[i]._id;
			cardModel.description = listOfProfiles[i].About;

			$scope.cards[i] = cardModel;

			// $scope.cards[i].names = nameChoices.splice();
			// $scope.cards[i].correctNameIndex = correctIndex;
			// $scope.cards[i].identifier = listOfProfiles[i]._id;
			// $scope.cards[i].description = listOfProfiles[i].About;
		}
	};

	function card(nameList, correctNameIndex, identifier, description) {
		this.names = nameList;
		this.correctNameIndex = correctIndex;
		this.identifier = identifier;
		this.description = description;
	};

	function namesList(correctIndex) {
		for (var x=0; x<4; x++) {
			if( x===correctIndex ) {
				nameChoices[x].prototype.firstName = 	listOfProfiles[i].FirstName;
				nameChoices[x].prototype.lastName =  	listOfProfiles[i].LastName;
				// nameChoices[x].description = 	listOfProfiles[i].About;
				// nameChoices[x].identifier = 	listOfProfiles[i]._id;


			} else {
				var randomWrongIndex = Math.floor(Math.random() * listOfProfiles.length);
				if( randomWrongIndex === correctIndex ) { // super rare
					if( correctIndex === 0 ) { correctIndex++; }
					else { correctIndex--; }
				}
				nameChoices[x].prototype.firstName = 	listOfProfiles[randomWrongIndex].FirstName;
				nameChoices[x].prototype.lastName = 	listOfProfiles[randomWrongIndex].LastName;
				// nameChoices[x].description = 	listOfProfiles[randomWrongIndex].About;
				// nameChoices[x].identifier = 	listOfProfiles[randomWrongIndex]._id;
			}
		}
	}


	var currentCardIndex = -1;
	$scope.getNextCard = function() {
		currentCardIndex++;
		var correctIndex = 		$scope.cards[currentCardIndex].correctNameIndex;
		$scope.profileId = 		$scope.cards[currentCardIndex].identifier;
		$scope.firstName = 		$scope.cards[currentCardIndex].names[correctIndex].firstName;
		$scope.lastName = 		$scope.cards[currentCardIndex].names[correctIndex].lastName;
		$scope.description = 	$scope.cards[currentCardIndex].description;
	};





/************************************************ Legacy code below this line ****************/
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

	var getThreeRandomNames = function() {
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