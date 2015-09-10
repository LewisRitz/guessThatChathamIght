module.exports = function(app) {
	var exec = require("child_process").exec,
	fileSystem = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = require('../app/models/user');
	Profile = require('../app/models/profile')
	var util = require('util');
	var http = require('http');

	app.get('/navigationSimulation', function(req, res){
		console.log('Request handler for "/naviationSimulation" called');
		res.render('../app/views/navigationSimulation.ejs');
	});

	app.get('/TestPage', function(req, res){
		console.log('Request handler for "/TestPage" called');
		res.render('../app/views/testPage.ejs');
	});

	app.get('/b4bPage', function(req, res){
		console.log('Request handler for "/b4bPage" called');
		res.render('../app/views/b4bPage.ejs');
	});

	app.get('/angular', function(req, res){
		console.log('Request handler for "/angular" called');
		var filePath = './node_modules/angular/angular.js';
		var stat = fileSystem.statSync(filePath);
		var readStream = fileSystem.createReadStream(filePath);
		readStream.pipe(res);
	});

	app.get('/navSimController', function(req, res){
		console.log('Request handler for "/navSimController" called');
		var filePath = './app/js/navSimController.js';
		var stat = fileSystem.statSync(filePath);
		var readStream = fileSystem.createReadStream(filePath);
		readStream.pipe(res);
	});

	app.get('/testController', function(req, res){
		console.log('Request handler for "/testController" called');
		var filePath = './app/js/testController.js';
		var stat = fileSystem.statSync(filePath);
		var readStream = fileSystem.createReadStream(filePath);
		readStream.pipe(res);
	});

	app.get('/b4bController', function(req, res){
		console.log('Request handler for "/b4bController" called');
		var filePath = './app/js/b4bController.js';
		var stat = fileSystem.statSync(filePath);
		var readStream = fileSystem.createReadStream(filePath);
		readStream.pipe(res);
	});

	app.get('/profilePhoto/:fileName', function(req, res){
		fileName = req.params.fileName;
		Profile.find({_id: fileName }, function(err, cursor){
			responseJSON = cursor;
			//console.log("PHOTO: "+JSON.stringify(responseJSON));
			//console.log("the file name: "+responseJSON[0].PhotoUrl);
			res.sendFile(responseJSON[0].PhotoUrl, {root: './public/profileImages/'});
		}).limit(1);
		//console.log(__dirname+);
		//res.sendfile(fileName, {root: './public/'});
		//res.sendfile('/whoAreThey.png')
	});

	app.post('/CreateProfile', function(req, res){
		//console.log('create profile called');
		//console.log(JSON.stringify(req.query));
		//var count = Profile.count()+1;
		var max = 300, min = 0;
		//console.log(util.inspect(req));
		var newProfile = new Profile({
			FirstName 		:  		req.query.firstName,
			LastName   		:  		req.query.lastName,
			About			: 		req.query.description,
			PhotoUrl 		: 		req.query.imageUrl,
			randomNumb		:  		Math.random()*(max - min)+min
		});
		newProfile.save(function(err){
			if(err) console.log(err);
			else { console.log("Profile Saved!"); }
		});
		res.send(newProfile);
	});

	app.get('/getListOfProfiles', function(req, res){
		console.log('get all profiles called');
		var responseJSON = "";
		Profile.find(function (err, profiles){
			if (err) { console.log(err); }
			responseJSON = profiles;
			//console.log(JSON.stringify(responseJSON, null, "\t"));
			res.send(JSON.stringify(responseJSON,null, 4));
			res.end();
		});
	});

	app.get('/getPageDataFromChatham', function(req, res){
		console.log('request for chatam page data called');
		var responseJSON = "";
		var options = {
			host: 'chathamfinancial.com',
			path: '/ajax-requests/ajax_leadership_team.php?action=get_members&mtt_cat=96&mtt_key=&mtt_alpha=&mtt_paged=2'
		};
		callback = function(response) {
			var str = '';
			response.on('data', function(chunk){
				str += chunk;
			});
			response.on('end', function(){
				var options = {
					host: 'chathamfinancial.com',
					path: '/ajax-requests/ajax_leadership_team.php?action=get_members&mtt_cat=96&mtt_key=&mtt_alpha=&mtt_paged=3'
				};


				responseJSON = str;
				res.send(responseJSON);
				res.end();
			});
		};
		responseJSON = http.get(options, callback).end();
	});

	app.get('/deleteAllProfiles', function(req, res) {
		Profile.remove({}, function(err, removed) {console.log("removed all surveys"); });
		Profile.find(function(err, profiles){ if(err){console.log(err); } responseJSON = profiles; res.send(responseJSON); })
	});

	// app.get('/deleteASpecificProfile', function(req, res) {
	// 	Profile.find({ _id: '5569e9864575d1ea1365ac21'}).remove().exec();
	// 	res.end();
	// });

	// app.get('/getARandomWrongName', function(req, res) {
	// 	var rand = Math.random();
	// 	if(req.session.wrongAnswerProfiles === undefined){ req.session.wrongAnswerProfiles = []; }
	// 	//if(req.session.wrongAnswerProfiles.length = 3) { req.session.wrongAnswerProfiles = []; }
	// 	console.log("session wrong ppl: "+JSON.stringify(req.session.wrongAnswerProfiles));

	// 	Profile.find({ $and: [{'randomNumb': { $gte: rand }}, { '_id': { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: req.session.wrongAnswerProfiles }}]}, function(err, cursor){
	// 		if(cursor === undefined) { cursor = []; }
	// 		if(cursor.length === 0){ // If a result wasn't found, check less than or equal.. this will always work if there is a record in the db
	// 			Profile.find({ $and: [{'randomNumb': { $lte: rand }}, { '_id': { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: req.session.wrongAnswerProfiles }}]}, function(err, cursor){
	// 				console.log('cursor: '+JSON.stringify(cursor[0]._id));
	// 				req.session.wrongAnswerProfiles.push(cursor[0]._id);
	// 				res.send(cursor[0]);
	// 				res.end();
	// 			}).limit(1);
	// 		} else { // If a result was found, return it and remember it's id
	// 			console.log('cursor: '+JSON.stringify(cursor[0]._id));
	// 			req.session.wrongAnswerProfiles.push(cursor[0]._id);
	// 			res.send(cursor[0]);
	// 			res.end();
	// 		}
	// 	}).limit(1);
	// });

	app.get('/getThreeRandomNames', function(req, res) {
		var max = 300, min = 0;
		var rand1 = Math.random()*(max - min)+min;
		var rand2 = Math.random()*(max - min)+min;
		var rand3 = Math.random()*(max - min)+min;
		var people = [];
		var profileArray = [];
		// console.log('prev profile: '+req.session.previousProfileUsed.FirstName);
		// console.log('rand1: '+rand1+' , rand2: '+rand2);
		Profile.find({ $and: [{'randomNumb': { $gte: rand1 }}, { '_id': { $ne: req.session.previousProfileUsed._id }}]}, function(err, cursor){
		//Profile.find({'randomNumb': { $gte: rand1 }}, function(err, cursor){
			if(cursor === undefined){ cursor = []; console.log("UNDEFINED FOUND"); }
			if(cursor.length === 0){   ///// DIDN'T FIND FIRST PROFILE
				Profile.find({ $and: [{'randomNumb': { $lte: rand1 }}, { '_id': { $ne: req.session.previousProfileUsed._id }}]}, function(err, cursor2){
				//Profile.find({'randomNumb': { $lte: rand1 }}, function(err, cursor2){
					// var responseJSON = cursor;
					// res.send(responseJSON[0]);
					// res.end();
					//console.log('this is a test: '+JSON.stringify(cursor2));
					people.push(cursor2[0]._id);
					profileArray.push(cursor2[0]);
					Profile.find({ $and: [{'randomNumb': { $gte: rand2 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor3){
					//Profile.find({ $and: [{'randomNumb': { $gte: rand2 }}, {'_id': { $nin: people }}]}, function(err, cursor3){
						if(cursor3 === undefined){ cursor3 = []; }
						if(cursor3.length === 0){ ///// DIDN'T FIND SECOND PROFILE
							Profile.find({ $and: [{'randomNumb': { $lte: rand2 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor4){
							//Profile.find({ $and: [{'randomNumb': { $lte: rand2 }}, {'_id': { $nin: people }}]}, function(err, cursor4){
								people.push(cursor4[0]._id);
								profileArray.push(cursor4[0]);
								Profile.find({$and: [{'randomNumb': { $gte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor5){
									if(cursor5 === undefined) { cursor5 = []; }
									if(cursor5.length === 0){ ///// DIDN'T FIND THIRD PROFILE
										Profile.find({$and: [{'randomNumb': { $lte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor6){
											people.push(cursor6[0]._id);
											profileArray.push(cursor6[0]);
											res.send(profileArray);
											res.end();
										}).limit(1);
									} else {	///// FOUND THIRD PROFILE
										people.push(cursor5[0]._id);
										profileArray.push(cursor5[0]);
										res.send(profileArray);
										res.end();
									}
								}).limit(1);
							});
						} else { ///// FOUND SECOND PROFILE
							people.push(cursor3[0]._id);
							profileArray.push(cursor3[0]);
							Profile.find({$and: [{'randomNumb': { $gte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor4){
								if(cursor4 === undefined) { cursor4 = []; }
								if(cursor4.length === 0){ ///// DIDN'T FIND THIRD PROFILE
									Profile.find({$and: [{'randomNumb': { $lte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor5){
										people.push(cursor5[0]._id);
										profileArray.push(cursor5[0]);
										res.send(profileArray);
										res.end();
									}).limit(1);
								} else {	///// FOUND THIRD PROFILE
									people.push(cursor4[0]._id);
									profileArray.push(cursor4[0]);
									res.send(profileArray);
									res.end();
								}
							}).limit(1);
						}
					}).limit(1);
				}).limit(1);
			} else { ///// FOUND FIRST PROFILE
				people.push(cursor[0]._id);
				profileArray.push(cursor[0]);
				Profile.find({ $and: [{'randomNumb': { $gte: rand2 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor2){
				//Profile.find({ $and: [{'randomNumb': { $gte: rand2 }}, {'_id': { $nin: people }}]}, function(err, cursor2){
					if(cursor2 === undefined) { cursor2 = []; }
					if(cursor2.length === 0){  ///// DIDN'T FIND SECOND PROFILE
						Profile.find({ $and: [{'randomNumb': { $lte: rand2 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor3){
							people.push(cursor3[0]._id);
							profileArray.push(cursor3[0]);
						//Profile.find({ $and: [{'randomNumb': { $lte: rand2 }}, {'_id': { $nin: people }}]}, function(err, cursor3){
							Profile.find({$and: [{'randomNumb': { $gte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor4){
								if(cursor4 === undefined) { cursor4 = []; }
								if(cursor4.length === 0){ ///// DIDN'T FIND THIRD PROFILE
									Profile.find({$and: [{'randomNumb': { $lte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor5){
										people.push(cursor5[0]._id);
										profileArray.push(cursor5[0]);
										res.send(profileArray);
										res.end();
									}).limit(1);
								} else {	///// FOUND THIRD PROFILE
									people.push(cursor4[0]._id);
									profileArray.push(cursor4[0]);
									res.send(profileArray);
									res.end();
								}
							}).limit(1);
						}).limit(1);
					} else { ///// FOUND SECOND PROFILE
						people.push(cursor2[0]._id);
						profileArray.push(cursor2[0]);
						Profile.find({$and: [{'randomNumb': { $gte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor3){
							if(cursor3 === undefined) { cursor3 = []; }
							if(cursor3.length === 0){ ///// DIDN'T FIND THIRD PROFILE
								Profile.find({$and: [{'randomNumb': { $lte: rand3 }}, { _id: { $ne: req.session.previousProfileUsed._id }}, {_id: { $nin: people }}]}, function(err, cursor4){
									people.push(cursor4[0]._id);
									profileArray.push(cursor4[0]);
									res.send(profileArray);
									res.end();
								}).limit(1);
							} else {	///// FOUND THIRD PROFILE
								people.push(cursor3[0]._id);
								profileArray.push(cursor3[0]);
								res.send(profileArray);
								res.end();
							}
						}).limit(1);
					}
				}).limit(1);
			}
		}).limit(1);
	});

	// var findARandomProfileLTE = function(rand){
	// 	Profile.find({'randomNumb': { $lte: rand }}, function(err, cursor){
	// 		console.log('first');
	// 		// var responseJSON = {};
	// 		// responseJSON._id = cursor[0]._id;
	// 		// responseJSON.FirstName = cursor[0].FirstName;
	// 		// responseJSON.LastName = cursor[0].LastName;
	// 		// responseJSON.About = cursor[0].About;
	// 		// responseJSON.PhotoUrl = cursor[0].PhotoUrl;
	// 		// res.send(responseJSON);
	// 		// res.end();
	// 		if(cursor===null){
	// 			var responseJSON = findARandomProfileGTE(rand);
	// 		} else if(cursor.length===0){	
	// 			var responseJSON = findARandomProfileGTE(rand);
	// 		} else {
	// 			var responseJSON = returnFoundProfile(cursor);
	// 		}
	// 	}).limit(1);
	// };
	// var findARandomProfileGTE = function(rand){
	// 	Profile.find({'randomNumb': { $gte: rand }}, function(err, cursor){
	// 		console.log('second');
	// 		if(cursor===null){
	// 			console.log("could not find any profiles");
	// 			//findARandomProfileLTE(rand);
	// 			responseJSON = ['nothing found'];
	// 		} else if(cursor.length===0){	
	// 			console.log("could not find any profiles");
	// 			//findARandomProfileLTE(rand);
	// 			responseJSON = ['nothing found'];
	// 		} else {
	// 			responseJSON = returnFoundProfile(cursor);
	// 		}
	// 		res.send(responseJSON);
	// 		res.end();
	// 	}).limit(1);
	// };
	// var returnFoundProfile = function(cursor){
	// 	var responseJSON = {};
	// 	responseJSON._id = cursor[0]._id;
	// 	responseJSON.FirstName = cursor[0].FirstName;
	// 	responseJSON.LastName = cursor[0].LastName;
	// 	responseJSON.About = cursor[0].About;
	// 	responseJSON.PhotoUrl = cursor[0].PhotoUrl;
	// 	return responseJSON;
	// };

	app.get('/getSessionData', function(req, res){
		var responseJSON = req.session.alreadyUsedArray;
		res.send(responseJSON);
		res.end();
	});

	app.get('/getProfileData', function(req, res){
		var responseJSON = [];
		Profile.find({}, function(err, cursor){
			if(err){ console.log('error',err); } else {
				responseJSON = cursor;
				res.send(responseJSON);
				res.end();
			}
		});
	});

	app.get('/randomProfile', function(req, res) {
		var max = 300, min = 0;
		var rand = Math.random()*(max - min)+min;
		req.session.wrongAnswerProfiles = [];
		//console.log('here: '+rand);
		//findARandomProfileLTE(rand);
		//var myCursor = Profile.find({'randomNumb': { $gte: rand }}).limit(1);
		//var myCursor = Profile.find();

		// while(myCursor.hasNext()){
		// 	printjson(myCursor.next());
		// }
		//console.log("there is a value: "+cursor.hasNext());
		Profile.count({}, function(err, count){



		req.session.alreadyUsedArray = req.session.alreadyUsedArray || [];

		//console.log('num of elements in collection: '+count);

		Profile.find({ $and: [{'randomNumb': { $gte: rand }}, {'_id': { $nin: req.session.alreadyUsedArray }}]}, function(err, cursor){
		//Profile.find({'randomNumb': { $gte: rand }}, function(err, cursor){
			//console.log(cursor.length);

			//console.log("cursor: "+util.inspect(cursor)+(cursor===undefined)+(cursor===null));

			if(req.session.alreadyUsedArray.length === count) {
				//console.log('REACHED THE MAX NUMBER OF ELEMENTS');
				req.session.alreadyUsedArray = [];
				res.status(203).end();
			} else 
			if(cursor===null||cursor===undefined){
				//console.log("null or undefined");
				//Profile.find({'randomNumb': { $lte: rand }}, function(err, cursor){
				//console.log('array: '+util.inspect(req.session.alreadyUsedArray));
				Profile.find({ $and: [{'randomNumb': { $lte: rand }}, { _id: { $nin: req.session.alreadyUsedArray }}]}, function(err, cursor2){
					//console.log("cursor2: "+util.inspect(cursor2)+(cursor2===undefined)+(cursor2===null));
					var cursor = cursor2;
					var responseJSON = {};
					responseJSON._id = cursor[0]._id;
					responseJSON.FirstName = cursor[0].FirstName;
					responseJSON.LastName = cursor[0].LastName;
					responseJSON.About = cursor[0].About;
					responseJSON.PhotoUrl = cursor[0].PhotoUrl;
					//console.log('who: '+cursor[0].FirstName);
					req.session.alreadyUsedArray.push(cursor[0]._id);
					//console.log("session array "+req.session.alreadyUsedArray.length);
					req.session.previousProfileUsed = cursor[0];
					res.send(responseJSON);
					res.end();
				}).limit(1);

			} else if(cursor.length === 0){
				//console.log('length 0');
				//Profile.find({'randomNumb': { $lte: rand }}, function(err, cursor){
				Profile.find({ $and: [{'randomNumb': { $lte: rand }}, {'_id': { $nin: req.session.alreadyUsedArray }}]}, function(err, cursor){
					var responseJSON = {};
					responseJSON._id = cursor[0]._id;
					responseJSON.FirstName = cursor[0].FirstName;
					responseJSON.LastName = cursor[0].LastName;
					responseJSON.About = cursor[0].About;
					responseJSON.PhotoUrl = cursor[0].PhotoUrl;
					//console.log('who: '+cursor[0].FirstName);
					//console.log('res zero: '+cursor === 0);
					req.session.alreadyUsedArray.push(cursor[0]._id);
					//console.log("session array "+req.session.alreadyUsedArray.length);
					req.session.previousProfileUsed = cursor[0];
					res.send(responseJSON);
					res.end();
				}).limit(1);
			} else {
				//console.log('found');
				//responseJSON = cursor;
				var responseJSON = {};
				responseJSON._id = cursor[0]._id;
				responseJSON.FirstName = cursor[0].FirstName;
				responseJSON.LastName = cursor[0].LastName;
				responseJSON.About = cursor[0].About;
				responseJSON.PhotoUrl = cursor[0].PhotoUrl;
				//console.log('who: '+cursor[0].FirstName);
				req.session.alreadyUsedArray.push(cursor[0]._id);
				//console.log("session array "+req.session.alreadyUsedArray.length);
				req.session.previousProfileUsed = cursor[0];
				res.send(responseJSON);
				res.end();
			}	
		}).limit(1);


		});


		// //var cmp = Math.random();
		//var responseJSON = "";
		// console.log("rand: "+rand);
		// var result = Profile.findOne({ randomNumb: { $gte : rand } });
		// if (result === null){
		// 	result = Profile.findOne({randomNumb: { $lte : rand }});
		// }
		//responseJSON = result.toObject();
		// Profile.find().skip()
		// skip: Math.floor((Math.random()*(numberOfDocs-1))), limit: 1},
		// 	function(err, results) {
		// 		if(results){
		// 			res.send(results);
		// 		} else { console.log(err); res.end(); }
		// 	}
		// });
		//res.send(responseJSON);
		// Profile.find(function(err, results){
		// 	if()
		// }).limit(1)
		//var responseJSON = Profile.find({ randomNumb: { $gte : rand } }).limit(1);

		// var something = Profile.findOne();
		// //console.log(JSON.stringify(something));
		// console.log(util.inspect(something.mongooseCollection.collection.s));
		// //res.send(Profile.findOne());
		// res.end();

		//res.send(responseJSON);

		//console.log(util.inspect(responseJSON));
		//console.log(responseJSON);
		//res.end();
	});


};