// app.js
var express = require('express'),
app = express(),
mongoose = require('mongoose'),
// pspt = require('passport'),
bodyParser = require('body-parser'),
session = require('express-session');
// flash = require('connect-flash'),
// fileSystem = require('fs'),
// path = require('path'),
// exec = require("child_process").exec;

configDB = require('./config/database.js');

mongoose.connect(configDB.url);
// mongoose.connect('localhost');
// //require('./config/passport')(pspt);

// // app.configure(function(){
// // 	app.use(express.logger('dev'));
// // 	app.use(express.cookieParser());n
// // 	app.use(express.bodyParser());




/////////////
/////////////

/////////////
/////////////

// // 	app.set('view engine', 'ejs');

// // 	app.use(express.session({
// // 		secret: 'iShouldProbablyGoExersizeButIKnowIWontLol' 
// // 	}));
// // 	app.use(pspt.initialize());
// // 	app.use(pspt.session());
// // 	app.use(flash());
// // });

// //app.use(express.logger('dev'));
// //app.use(express.cookieParser());
// //app.use(express.bodyParser());

app.set('view engine', 'ejs');
//app.use(express.cookieParser());
app.use(session({
	secret: 'thisIsSomeRandomPasswordBlahBlahHipnoFrog',
	resave: true,
	saveUninitialized: true
}));
// app.use(function (req, res, next){
// 	var views = req.session.views

// 	if (!views) {
// 		views = req.session.views = {}
// 	}

// 	var pathname = parseurl(req).pathname

// 	views[pathname] = (views[pathname] || 0) + 1

// 	next()
// });

// // app.use(express.session({
// // 	secret: 'iShouldProbablyGoExersizeButIKnowIWontLol' 
// // }));
// //app.use(pspt.initialize());
// //app.use(pspt.session());
// //app.use(flash());

require('./app/routes.js')(app);

app.get('/', function(req, res){
	// if(req.session.lastPage) {
	// 	res.write('Last page was: '+req.session.lastPage + '. ');
	// }

	//req.session.lastPage = '/awesome';
	if (req.session.logged) res.send('Welcome back!');
	else {
		req.session.logged = true;
		res.send('Hello Worls!');
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// process.on('uncaughtException', function (err){
// 	console.log(err);
// });

var server = app.listen(process.env.PORT || 3000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s',host,port);
});

// app.listen(port);
// console.log("app listening on port "+port);