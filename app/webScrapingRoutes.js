module.exports = function(app) {


var http = require("http");
var cheerio = require("cheerio");

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

			$("li.section-2").each(function(i, e){
				//console.log("here");
				for(var i=0;i<$(e)['0'].children.length;i++){
					console.log($(e)['0'].children[i]);
					// if(($(e)['0'].children[i].name === 'img') || (($(e)['0'].children[i].attribs.class === 'img-title list'))){
					// 	console.log($(e)['0'].children[i]);
					// }
				}
				//if($(e)['0'].children)
				//console.log($(e)['0'].children);
			});

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