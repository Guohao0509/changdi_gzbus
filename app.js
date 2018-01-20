var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var apiFilter = require('./routes/api-filter');
 var router = require('./routes/api_filter.js');
var authFilter = require('./routes/auth-filter');
var filesFilter = require('./routes/files-filter.js');

var index = require('./routes/index');
var compression = require('compression');
var app = express();

//schedule 在每周日晚上0点清除图片;
var clearFile = require('./modules/clear_file.js');
clearFile();

//判断是linux环境还是windows环境，来访问不同的后端服务
var env=require('./conf.js')
console.log(env)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//开启gzip压缩
app.use(compression());
app.use(session({
  secret: 'bugu_bus_secret',
  name: 'app',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {maxAge: 3600*1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: true,
  saveUninitialized: true,
  rolling: true
}));

//app.use('/',index);
app.use(express.static(path.join(__dirname, 'public')));

//filter
app.use('/auth',authFilter);
app.use('/files',filesFilter);
app.use('/api',router);

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

// module.exports = app;
// 设置端口号 5050
app.set('port', process.env.PORT || '5050');

// 监听端口 app.get() 获取设置值
app.listen(app.get('port'), function() {
  console.log('Start at the port: ' + app.get('port'));
});