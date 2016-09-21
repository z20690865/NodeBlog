var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/home/index');
var posts = require('./routes/home/posts');

var users = require('./routes/admin/users');
var admin = require('./routes/admin/admin');
var cats = require('./routes/admin/cats');
var article = require('./routes/admin/posts');




var app = express();
var session = require('express-session');
app.use(session({
  secret: 'blog',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'views/admin')));

app.use('/', routes);
//app.use('/users', users);
app.use('/posts',posts);


app.use('/admin/index',checkLogin);
app.use('/admin/index', admin);
//后台分类
app.use('/admin/cats',checkLogin);
app.use('/admin/cats', cats);
//后台文章
app.use('/admin/posts',checkLogin);
app.use('/admin/posts',article);
//后台登陆
app.use('/admin/users',users);


function checkLogin(req,res,next){
  console.log(req.session);
  //判断用户是否已经登录，就看session是否有登录的标志
  if (!req.session.isLogin) {
    //跳转到登录页面
    res.redirect('/admin/users/login');
  }
  //需要调用next方法，将控制权转交
  next();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
