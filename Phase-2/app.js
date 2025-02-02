var express = require('express'),
    cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var index = require('./routes/index');
var ecourt = require('./routes/multie');
var supreme = require('./routes/supreme');
var map = require('./routes/map');
//var city = require('./routes/city');
var user = require('./routes/user');
var url = 'mongodb://127.0.0.1:27017/Ecourt';
var mongoose = require('mongoose'),
    assert = require('assert');
mongoose.Promise = global.Promise;
mongoose.connect(url);
var db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function (){
    console.log('Connected to server Successfully');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname)));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.options('*', cors());
app.use(cors());
app.use('/user', user);
app.use('/supreme', ecourt);
app.use('/supreme1', supreme);
app.use('/map', map);
//app.use('/city', city);
app.use('/', express.static('dist'));
app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;