module.exports = function(app) {


var http = require("http");
var cheerio = require("cheerio");
var path = require("path");
var numberOfPagesToPullFrom = 44;
var util = require('util');
var fs = require('fs'),
	request = require('request');

// Utility function that downloads a URL and incvokes callback with the data
function download(url, callback){
	http.get(url, function(res){
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
}

var url = "http://www.dailymail.co.uk/news/article-2297585/Wild-squirrels-pose-charming-pictures-photographer-hides-nuts-miniature-props.html"
var url2 = "http://www.chathamfinancial.com/about/leadership-team/"

var max = 300, min = 0;
// console.log("request for '/downloadWebpage' called");
// 	download(url, function(data) {
// 	  if (data) {
// 	    console.log(data);
// 	  }
// 	  else console.log("error");  

// 	 //  	res.send(data);
// 		// res.end();
// 	});
	//res.end();

// var saveTheFoundProfile = function(str){
// // res.end();
// 	var profiles = JSON.parse(str);
// 	for(var i=0;i<profiles.items.length;i++){ 
// 		var theProfile = profiles.items[i];
// 		var thePhotoUrl = theProfile.post_fname+' '+theProfile.post_lname+'/whoAreThey'+path.extname(theProfile.post_image);
// 		//var thePhotoUrl = listOfProfiles[i].FirstName+' '+listOfProfiles[i].LastName+'/whoAreThey'+path.extname(listOfProfiles[i].ProfileImage);
// 		var newProfile = new Profile({
// 			FirstName 		:  		theProfile.post_fname,				//req.query.firstName,
// 			LastName   		:  		theProfile.post_lname,					//req.query.lastName,
// 			About			: 		'',											//req.query.description,
// 			PhotoUrl 		: 		thePhotoUrl,								//req.query.imageUrl,
// 			randomNumb		:  		Math.random()*(max - min)+min
// 		});
// 		newProfile.save(function(err){
// 			if(err) console.log(err);
// 			else { console.log("Profile "+i+" Saved!"); }
// 		});
// 		res.send(newProfile);
// 	}
// };

app.get('/downloadUserImages', function(req, res){
	Profile.find({}, function(err, cursor){
		if(err){ console.log('error',err); } else {
			responseJSON = cursor;

			console.log(responseJSON.length);

			for(var i=0;i<responseJSON.length;i++){
			//for(var i=0;i<44;i++){
				console.log('here1');
				if(responseJSON[i].PhotoSource===null){ }
				else {
					console.log('here2');
					//console.log('image: '+i+' '+responseJSON[i].PhotoSource.split('.').pop());
					var imageUrl = responseJSON[i].PhotoSource;
					var folderName = responseJSON[i].FirstName+" "+responseJSON[i].LastName;
					var folderPath = './public/profileImages/'+folderName;
					var fileExtension = responseJSON[i].PhotoSource.split('.').pop();
					var fullFilePath = folderPath+'/whoAreThey.'+fileExtension;



					/******** UNDO THIS COMMENT TO ENABLE PHOTOSAVING *********/
					// downloadUserProfileImages(imageUrl, folderPath, fullFilePath, function(){
					// 	console.log('done');
					// });

				}

			}





			res.send(responseJSON);
			res.end();
		}
	});






	// var imageUrl = 'http:\/\/www.chathamfinancial.com\/wp-content\/uploads\/2014\/05\/Chua_Pat.jpg';
	// var filename = 'guessWho.jpg';
	// downloadUserProfileImages(imageUrl, filename, function(){
	// 	console.log('done');
	// });
	// res.end();
});

var downloadUserProfileImages = function(uri, folderPath, filename, callback){
	request.head(uri, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);

		//fs.mkdirSync('./public/profileImages/test test');
		mkdirSync(folderPath);

		var writeStream = fs.createWriteStream(filename);

		//mkdirSync('./public/profileImages/Patricia Chua');

		//var writeStream = fs.createWriteStream('./public/profileImages/Patricia Chua/whoAreThey.jpg');

		request(uri).pipe(writeStream).on('close',callback);

		//request(uri).pipe(fs.createWriteStream('./public'+filename)).on('close', callback);
	});
};

var mkdirSync = function(path){
	try {
		fs.mkdirSync(path);
	} catch(e) {
		if( e.code != 'EEXIST' ) throw e;
	}
};








var savingProfilesCallback = function(response) {
	var str = '';
	var responseJSON;
	response.on('data', function(chunk){
		str += chunk;
	});
	response.on('end', function(){
		// saveTheFoundProfile(str);
		responseJSON = str;
		// res.send(responseJSON);
		// res.end();
		var profiles = JSON.parse(str);
		for(var i=0;i<profiles.items.length;i++){ 
			var theProfile = profiles.items[i];
			var thePhotoUrl = theProfile.post_fname+' '+theProfile.post_lname+'/whoAreThey'+path.extname(theProfile.post_image);

			var aboutPageDataWithoutId = '/ajax-requests/ajax_leadership_team.php?action=get_member_detail&memberid=';
			var aboutPageDataWithId = aboutPageDataWithoutId+theProfile.post_id;

			var theSecondRequestOption = {
				host: 'chathamfinancial.com',
				path: aboutPageDataWithId
			};

			var newProfile = new Profile({
				FirstName 		:  		theProfile.post_fname,				//req.query.firstName,
				LastName   		:  		theProfile.post_lname,					//req.query.lastName,
				About			: 		'',											//req.query.description,
				PhotoUrl 		: 		thePhotoUrl,
				PhotoSource		: 		theProfile.post_image,								//req.query.imageUrl,
				randomNumb		:  		Math.random()*(max - min)+min
			});
			var someParentVar = "this is the test";
			// response, someParentVar
			http.get(theSecondRequestOption, callbackWithPassedParameterData(newProfile));

			/*
			http.get(theSecondRequestOption, function(response) {
				//console.log('test: '+someParentVar);
				var someParentVar = i;
				var str = '';
				response.on('data', function(chunk){
					str += chunk;
				});
				response.on('end', function(){
					//console.log('string: '+str);
					//console.log('test: '+theProfile.post_fname);
					console.log('test: '+someParentVar);
				});
			});//.apply(this, [someParentVar]));
			//.apply(this, [response]));
			//.bind( {test: someParentVar}));

			//http.get(theSecondRequestOption, savingProfilesCallback2(res)).end();
			
			*/

			//var thePhotoUrl = listOfProfiles[i].FirstName+' '+listOfProfiles[i].LastName+'/whoAreThey'+path.extname(listOfProfiles[i].ProfileImage);
			// newProfile.save(function(err){
			// 	if(err) console.log(err);
			// 	else { console.log("Profile "+thePhotoUrl+" Saved!"); }
			// });
			//res.send(newProfile);
		}
		//res.send(responseJSON);
	});
};

var callbackWithPassedParameterData = function(newProfile){
	return function(response){
		//var someParentVar = i;
		var str = '';
		response.on('data', function(chunk){
			str += chunk;
		});
		response.on('end', function(){
			//console.log('string: '+str);
			//var aboutSection = JSON.parse(str);
			//console.log('string: '+str);
			//console.log('test: '+theProfile.post_fname+' '+theProfile.post_lname);
			//console.log('test: '+someParentVar);
			var $ = cheerio.load(str);
			newProfile.About = $('p').text();
			//console.log('about section: '+newProfile.About);
			//console.log('name '+newProfile.FirstName+' '+newProfile.LastName);

			//console.log(JSON.stringify(newProfile,null,"\t"));

			// newProfile.save(function(err){
			// 	if(err) console.log(err);
			// 	else { console.log("Profile Saved!"); }
			// });
		});
	}
}

var testFunction = function(){
	console.log("test function");
};

var savingProfilesCallback2 = function(response){
	var str = '';
	response.on('data', function(chunk){
		str += chunk;
	});
	response.on('end', function(){
		console.log('string: '+str);
	});

	//console.log('test: '+newProfile);
	 //console.log('theNewProfile: '+
	// 	util.inspect(newProfile.socket._events));
		//JSON.stringify(newProfile, null, "\t"));

	// newProfile.save(function(err){
	// 	if(err) console.log(err);
	// 	else { console.log("Profile "+thePhotoUrl+" Saved!"); }
	// });
};

app.get('/getAllChathamPageData', function(req, res){

	console.log('request for chatham page data called');
	var responseJSON = "";
	var httpRequestOptions = [];
	for (var x=1;x<=numberOfPagesToPullFrom;x++){
		var pathWithoutPageNumber = '/ajax-requests/ajax_leadership_team.php?action=get_members&mtt_cat=96&mtt_key=&mtt_alpha=&mtt_paged=';
		var pathWithPageNumber = pathWithoutPageNumber+x;
		var theOption = {
			host: 'chathamfinancial.com',
			path: pathWithPageNumber
		};
		//httpRequestOptions.push(theOption);

		/******* UNDO THIS COMMENT TO ENABLE PROFILE SAVING *****/
		// http.get(theOption, savingProfilesCallback).end();
	}
	//console.log(JSON.stringify(httpRequestOptions));
	
	res.end();
});

//http://www.chathamfinancial.com/ajax-requests/ajax_leadership_team.php?action=get_member_detail&memberid=4406

// app.get('/downloadWebpage', function(req, res){
// 	console.log("request for '/downloadWebpage' called");
// 	//var data = '';
// 	download(url2, function(data) {
// 		if (data) {
// 			//console.log(data);
// 			var $ = cheerio.load(data);
// 			// $("li.section-1 > img").each(function(i, e){
// 			// 	//console.log("here");
// 			// 	//console.log($(e).arrt("src"));
// 			// 	console.log($(e)['0'].attribs.src);
// 			// });

// 			// $("div.right-section").each(function(i, e){
// 			// 	//console.log("here");
// 			// 	//console.log($(e).arrt("src"));
// 			// 	for(var i=0; i<$(e)['0'].children.length; i++){
// 			// 		//essconsole.log("here");
// 			// 		if($(e)['0'].children[i].type==='tag'){
// 			// 			console.log($(e)['0'].children[i].children);
// 			// 		}
// 			// 	}
// 			// 	//console.log($(e)['0'].attribs.src);
// 			// });
// 			var listOfProfiles = [];
// 			$("li.section-1").each(function(i, e){
// 				//console.log("here");
// 				var profileObject = {};
// 				for(var i=0;i<$(e)['0'].children.length;i++){
// 					//console.log($(e)['0'].children[i]);
// 					if($(e)['0'].children[i].attribs === undefined){} else {
// 						if(($(e)['0'].children[i].name === 'img')){

// 							//console.log($(e)['0'].children[i].attribs.src);
// 							profileObject.ProfileImage = $(e)['0'].children[i].attribs.src;
// 						} else if (($(e)['0'].children[i].attribs.class === 'img-title list')){
// 							for(var x=0;x<$(e)['0'].children[i].children.length;x++){
// 								if(x===0){ 
// 									//console.log('FirstName: '+($(e)['0'].children[i].children[x].data)); 
// 									profileObject.FirstName = $(e)['0'].children[i].children[x].data;
// 								}
// 				 				else if(x===2) { 
// 				 					//console.log('LastName: '+$(e)['0'].children[i].children[x].data); 
// 				 					profileObject.LastName = $(e)['0'].children[i].children[x].data;
// 				 				}
// 								//console.log($(e)['0'].children[i]);
// 							}
// 						}
// 					}
// 				}
// 				listOfProfiles.push(profileObject);
// 				//if($(e)['0'].children)
// 				//console.log($(e)['0'].children);
// 			});
// 			$("li.section-2").each(function(i, e){
// 				//console.log("here");
// 				var profileObject = {};
// 				for(var i=0;i<$(e)['0'].children.length;i++){
// 					//console.log($(e)['0'].children[i]);
// 					if($(e)['0'].children[i].attribs === undefined){} else {
// 						if(($(e)['0'].children[i].name === 'img')){

// 							//console.log($(e)['0'].children[i].attribs.src);
// 							profileObject.ProfileImage = $(e)['0'].children[i].attribs.src;
// 						} else if (($(e)['0'].children[i].attribs.class === 'img-title list')){
// 							for(var x=0;x<$(e)['0'].children[i].children.length;x++){
// 								if(x===0){ 
// 									//console.log('FirstName: '+($(e)['0'].children[i].children[x].data)); 
// 									profileObject.FirstName = $(e)['0'].children[i].children[x].data;
// 								}
// 				 				else if(x===2) { 
// 				 					//console.log('LastName: '+$(e)['0'].children[i].children[x].data); 
// 				 					profileObject.LastName = $(e)['0'].children[i].children[x].data;
// 				 				}
// 								//console.log($(e)['0'].children[i]);
// 							}
// 						}
// 					}
// 				}
// 				listOfProfiles.push(profileObject);
// 				//if($(e)['0'].children)
// 				//console.log($(e)['0'].children);
// 			});
// 			// $("li.section-3").each(function(i, e){
// 			// 	//console.log("here");
// 			// 	var profileObject = {};
// 			// 	for(var i=0;i<$(e)['0'].children.length;i++){
// 			// 		//console.log($(e)['0'].children[i]);
// 			// 		if($(e)['0'].children[i].attribs === undefined){} else {
// 			// 			if(($(e)['0'].children[i].name === 'img')){

// 			// 				//console.log($(e)['0'].children[i].attribs.src);
// 			// 				profileObject.ProfileImage = $(e)['0'].children[i].attribs.src;
// 			// 			} else if (($(e)['0'].children[i].attribs.class === 'img-title list')){
// 			// 				for(var x=0;x<$(e)['0'].children[i].children.length;x++){
// 			// 					if(x===0){ 
// 			// 						//console.log('FirstName: '+($(e)['0'].children[i].children[x].data)); 
// 			// 						profileObject.FirstName = $(e)['0'].children[i].children[x].data;
// 			// 					}
// 			// 	 				else if(x===2) { 
// 			// 	 					//console.log('LastName: '+$(e)['0'].children[i].children[x].data); 
// 			// 	 					profileObject.LastName = $(e)['0'].children[i].children[x].data;
// 			// 	 				}
// 			// 					//console.log($(e)['0'].children[i]);
// 			// 				}
// 			// 			}
// 			// 		}
// 			// 	}
// 			// 	listOfProfiles.push(profileObject);
// 			// 	//if($(e)['0'].children)
// 			// 	//console.log($(e)['0'].children);
// 			// });

// 			// var max = 300, min = 0;
// 			for(var i=0;i<listOfProfiles.length;i++){
// 				//console.log(JSON.stringify(listOfProfiles[i]));
// 				//console.log(listOfProfiles[i].FirstName+' '+listOfProfiles[i].LastName+'/whoAreThey'+path.extname(listOfProfiles[i].ProfileImage));
// 				//console.log(util.inspect(req));



// 				// var thePhotoUrl = listOfProfiles[i].FirstName+' '+listOfProfiles[i].LastName+'/whoAreThey'+path.extname(listOfProfiles[i].ProfileImage);
// 				// var newProfile = new Profile({
// 				// 	FirstName 		:  		listOfProfiles[i].FirstName,				//req.query.firstName,
// 				// 	LastName   		:  		listOfProfiles[i].LastName,					//req.query.lastName,
// 				// 	About			: 		'',											//req.query.description,
// 				// 	PhotoUrl 		: 		thePhotoUrl,								//req.query.imageUrl,
// 				// 	randomNumb		:  		Math.random()*(max - min)+min
// 				// });
// 				// newProfile.save(function(err){
// 				// 	if(err) console.log(err);
// 				// 	else { console.log("Profile Saved!"); }
// 				// });
// 				//res.send(newProfile);

// 			}
// 			// console.log(JSON.stringify('Profiles: '+listOfProfiles));

// 			// $("li.section-3").each(function(i, e){
// 			// 	console.log("here");
// 			// });


// 			// $("div.content-area-about > img").each(function(i, e){
// 			// 	console.log($(e).arrt("src"));
// 			// });


// 			// var index = 0;
// 			// $("div.img-title").each(function(i, e){
// 			// 	//if(index===0){
// 			// 		for(var i=0;i<($(e)['0'].children).length;i++){
// 			// 			if($(e)['0'].children[i].type === 'text'){
// 			// 				//console.log('i: '+i);
// 			// 				if(i===0){ console.log('FirstName: '+$(e)['0'].children[i].data) }
// 			// 				else if(i===2) { console.log('LastName: '+$(e)['0'].children[i].data) }
// 			// 				//console.log($(e)['0'].children[i].data);
// 			// 			}
// 			// 		}
// 			// 		//console.log("length: "+($(e)['0'].children).length);
// 			// 		// if($(e)['0'].children.type === 'text'){
// 			// 		// 	//console.log($(e)['0'].children.data);
// 			// 		// }
// 			// 		//console.log($(e)['0'].children);
// 			// 	//}
// 			// 	index++;
// 			// });
// 			// console.log('index: '+index);




// 			// $("div.artSplitter > img.blkBorder").each(function(i, e) {
// 			// 	console.log($(e).attr("src"));
// 			// });
// 			console.log("done");
// 		}
// 		else console.log("error");  

// 		// res.end();
// 		// res.send(data);
// 		res.end();
// 	});




// 	// download(url, function(data) {
// 	//   if (data) {
// 	//     //console.log(data);
// 	//     var $ = cheerio.load(data);
// 	//     $("div.artSplitter > img.blkBorder").each(function(i, e) {
// 	//     	console.log($(e).attr("src"));
// 	//     });
// 	//     console.log("done");
// 	//   }
// 	//   else console.log("error");  

// 	// 	// res.end();
// 	// 	// res.send(data);
// 	// 	// res.end();
// 	// });
// });



};