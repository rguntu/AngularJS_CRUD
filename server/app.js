var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signup = require('./routes/signup');
const mongoose = require('mongoose');

var question = require('./routes/question');


var app = express();
app.use(cors()) // <--- CORS

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.engine('html', engines.mustache);
//app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/signup', signup);
app.use('/questions', question);

mongoose.connect('mongodb://localhost:27017/QA');
const db = mongoose.connection;

db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});


// In production, we'll actually serve our angular app from express
 if (app.get('env') === 'production') { 
//if (app.get('env') === 'development') {  
  app.use(express.static(path.join(__dirname, '/dist')));



  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.status(500).json({
      message: err.message,
      error: err
  });
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
