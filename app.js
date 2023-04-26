let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
const mongoose = require('mongoose');
let appConfig = require('./appConfig.json');
let AuthJWT = require('./middlewares/jwtToken');

let indexRouter = require('./routes/index');
let faqRouter = require('./routes/faqs/faqs');
let aboutRouter = require('./routes/about/about');
let profileRouter = require('./routes/profile/profile');
let signInRoute = require('./routes/auth/signin');
let signUpRoute = require('./routes/auth/signup');
let forgetPasswordRoute = require('./routes/auth/forgetpassword');
let dashboardRouter = require('./routes/dashboard/dashboard');

let app = express();

//Session configuration
app.set('trust proxy', 1); // trust first proxy
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		// cookie: { secure: true }
	})
);

//Data-Base Connection
mongoose
	.connect(appConfig.LIVE_MONGOOSE_URL)
	.then(() => {
		console.log(
			`Connected-to-Mongo-DB-Successful at http://localhost:${appConfig.PORT}`
		);
	})
	.catch((e) => {
		console.log('Error', e.message);
	});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signin', signInRoute);
app.use('/signup', signUpRoute);
app.use('/forgetpassword', forgetPasswordRoute);
app.use('/faqs', faqRouter);
app.use('/about', aboutRouter);
app.use('/profile', AuthJWT.authenticateToken, profileRouter);
app.use('/dashboard', AuthJWT.authenticateToken, dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
