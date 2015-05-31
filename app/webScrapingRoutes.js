module.exports = function(app) {


var http = require("http");
var cheerio = require("cheerio");
var path = require("path");

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

app.get('/downloadWebpage', function(req, res){
	console.log("request for '/downloadWebpage' called");
	//var data = '';
	download(url2, function(data) {
		if (data) {
			//console.log(data);
			var $ = cheerio.load(data);
			// $("li.section-1 > img").each(function(i, e){
			// 	//console.log("here");
			// 	//console.log($(e).arrt("src"));
			// 	console.log($(e)['0'].attribs.src);
			// });

			// $("div.right-section").each(function(i, e){
			// 	//console.log("here");
			// 	//console.log($(e).arrt("src"));
			// 	for(var i=0; i<$(e)['0'].children.length; i++){
			// 		//essconsole.log("here");
			// 		if($(e)['0'].children[i].type==='tag'){
			// 			console.log($(e)['0'].children[i].children);
			// 		}
			// 	}
			// 	//console.log($(e)['0'].attribs.src);
			// });
			var listOfProfiles = [];
			$("li.section-1").each(function(i, e){
				//console.log("here");
				var profileObject = {};
				for(var i=0;i<$(e)['0'].children.length;i++){
					//console.log($(e)['0'].children[i]);
					if($(e)['0'].children[i].attribs === undefined){} else {
						if(($(e)['0'].children[i].name === 'img')){

							//console.log($(e)['0'].children[i].attribs.src);
							profileObject.ProfileImage = $(e)['0'].children[i].attribs.src;
						} else if (($(e)['0'].children[i].attribs.class === 'img-title list')){
							for(var x=0;x<$(e)['0'].children[i].children.length;x++){
								if(x===0){ 
									//console.log('FirstName: '+($(e)['0'].children[i].children[x].data)); 
									profileObject.FirstName = $(e)['0'].children[i].children[x].data;
								}
				 				else if(x===2) { 
				 					//console.log('LastName: '+$(e)['0'].children[i].children[x].data); 
				 					profileObject.LastName = $(e)['0'].children[i].children[x].data;
				 				}
								//console.log($(e)['0'].children[i]);
							}
						}
					}
				}
				listOfProfiles.push(profileObject);
				//if($(e)['0'].children)
				//console.log($(e)['0'].children);
			});
			$("li.section-2").each(function(i, e){
				//console.log("here");
				var profileObject = {};
				for(var i=0;i<$(e)['0'].children.length;i++){
					//console.log($(e)['0'].children[i]);
					if($(e)['0'].children[i].attribs === undefined){} else {
						if(($(e)['0'].children[i].name === 'img')){

							//console.log($(e)['0'].children[i].attribs.src);
							profileObject.ProfileImage = $(e)['0'].children[i].attribs.src;
						} else if (($(e)['0'].children[i].attribs.class === 'img-title list')){
							for(var x=0;x<$(e)['0'].children[i].children.length;x++){
								if(x===0){ 
									//console.log('FirstName: '+($(e)['0'].children[i].children[x].data)); 
									profileObject.FirstName = $(e)['0'].children[i].children[x].data;
								}
				 				else if(x===2) { 
				 					//console.log('LastName: '+$(e)['0'].children[i].children[x].data); 
				 					profileObject.LastName = $(e)['0'].children[i].children[x].data;
				 				}
								//console.log($(e)['0'].children[i]);
							}
						}
					}
				}
				listOfProfiles.push(profileObject);
				//if($(e)['0'].children)
				//console.log($(e)['0'].children);
			});
			// $("li.section-3").each(function(i, e){
			// 	//console.log("here");
			// 	var profileObject = {};
			// 	for(var i=0;i<$(e)['0'].children.length;i++){
			// 		//console.log($(e)['0'].children[i]);
			// 		if($(e)['0'].children[i].attribs === undefined){} else {
			// 			if(($(e)['0'].children[i].name === 'img')){

			// 				//console.log($(e)['0'].children[i].attribs.src);
			// 				profileObject.ProfileImage = $(e)['0'].children[i].attribs.src;
			// 			} else if (($(e)['0'].children[i].attribs.class === 'img-title list')){
			// 				for(var x=0;x<$(e)['0'].children[i].children.length;x++){
			// 					if(x===0){ 
			// 						//console.log('FirstName: '+($(e)['0'].children[i].children[x].data)); 
			// 						profileObject.FirstName = $(e)['0'].children[i].children[x].data;
			// 					}
			// 	 				else if(x===2) { 
			// 	 					//console.log('LastName: '+$(e)['0'].children[i].children[x].data); 
			// 	 					profileObject.LastName = $(e)['0'].children[i].children[x].data;
			// 	 				}
			// 					//console.log($(e)['0'].children[i]);
			// 				}
			// 			}
			// 		}
			// 	}
			// 	listOfProfiles.push(profileObject);
			// 	//if($(e)['0'].children)
			// 	//console.log($(e)['0'].children);
			// });

			var max = 300, min = 0;
			for(var i=0;i<listOfProfiles.length;i++){
				//console.log(JSON.stringify(listOfProfiles[i]));
				//console.log(listOfProfiles[i].FirstName+' '+listOfProfiles[i].LastName+'/whoAreThey'+path.extname(listOfProfiles[i].ProfileImage));
				//console.log(util.inspect(req));



				// var thePhotoUrl = listOfProfiles[i].FirstName+' '+listOfProfiles[i].LastName+'/whoAreThey'+path.extname(listOfProfiles[i].ProfileImage);
				// var newProfile = new Profile({
				// 	FirstName 		:  		listOfProfiles[i].FirstName,				//req.query.firstName,
				// 	LastName   		:  		listOfProfiles[i].LastName,					//req.query.lastName,
				// 	About			: 		'',											//req.query.description,
				// 	PhotoUrl 		: 		thePhotoUrl,								//req.query.imageUrl,
				// 	randomNumb		:  		Math.random()*(max - min)+min
				// });
				// newProfile.save(function(err){
				// 	if(err) console.log(err);
				// 	else { console.log("Profile Saved!"); }
				// });
				//res.send(newProfile);

			}
			// console.log(JSON.stringify('Profiles: '+listOfProfiles));

			// $("li.section-3").each(function(i, e){
			// 	console.log("here");
			// });


			// $("div.content-area-about > img").each(function(i, e){
			// 	console.log($(e).arrt("src"));
			// });


			// var index = 0;
			// $("div.img-title").each(function(i, e){
			// 	//if(index===0){
			// 		for(var i=0;i<($(e)['0'].children).length;i++){
			// 			if($(e)['0'].children[i].type === 'text'){
			// 				//console.log('i: '+i);
			// 				if(i===0){ console.log('FirstName: '+$(e)['0'].children[i].data) }
			// 				else if(i===2) { console.log('LastName: '+$(e)['0'].children[i].data) }
			// 				//console.log($(e)['0'].children[i].data);
			// 			}
			// 		}
			// 		//console.log("length: "+($(e)['0'].children).length);
			// 		// if($(e)['0'].children.type === 'text'){
			// 		// 	//console.log($(e)['0'].children.data);
			// 		// }
			// 		//console.log($(e)['0'].children);
			// 	//}
			// 	index++;
			// });
			// console.log('index: '+index);




			// $("div.artSplitter > img.blkBorder").each(function(i, e) {
			// 	console.log($(e).attr("src"));
			// });
			console.log("done");
		}
		else console.log("error");  

		// res.end();
		// res.send(data);
		res.end();
	});




	// download(url, function(data) {
	//   if (data) {
	//     //console.log(data);
	//     var $ = cheerio.load(data);
	//     $("div.artSplitter > img.blkBorder").each(function(i, e) {
	//     	console.log($(e).attr("src"));
	//     });
	//     console.log("done");
	//   }
	//   else console.log("error");  

	// 	// res.end();
	// 	// res.send(data);
	// 	// res.end();
	// });
});



};