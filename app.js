var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');//处理收藏夹图标
var cookieParser = require('cookie-parser');
var logger = require('morgan');//处理日志

var indexRouter = require('./routes/index');//根路由
var usersRouter = require('./routes/users');//用户路由
var articleRouter = require('./routes/article');//文章路由

var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var session = require('express-session');//session
var mongoStore = require('connect-mongo')(session);//将session作为参数传入  回话保到mongodb数据库中 注意：session是依赖于cookie-parse的 用的时候必须要放在其下面
var flash = require('connect-flash');//一闪而过  提示信息的显示
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
//因为.jade类型的文件和.html语法差别大  所有换为.esj
var ejs = require('ejs');
require('./util');//md5加密
require('./db/index.js');//引入数据库,会默认取找db下的index.js文件的
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置模板的存放路径
// app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);//设置对html文件的渲染方式
app.set('view engine', 'html');//设置模板引擎

app.use(logger('dev'));//指定日志输出的格式
app.use(express.json());//处理json 通过Content-Type来判断是否有自己来处理
app.use(express.urlencoded({//处理form-urlencoded
    extended: false
}));

app.use(cookieParser());//处理cookie 把请求头的cookie转成对象，加入一个cookie函数的属性
var setings = require('./seting.js')
app.use(session({
    secret:'myproject',
    resave:true,
    saveUninitialized:true,
    store: new mongoStore({
        url:setings.dbUrl
    })
}));
app.use(flash());// 会添加2个方法 一个写 一个读
app.use(function(req,res,next){
    // 全局 session方式
    res.locals.user = req.session.user; 
    // res.locals.success = req.session.success||''; 
    // res.locals.error = req.session.error||''; 
    //全局 flash方式--读  第一次就完毕了 第二次是取不到的
    res.locals.success = req.flash('success').toString(); 
    res.locals.error = req.flash('error').toString(); 
    next();
})
app.use(express.static(path.join(__dirname, 'public')));//静态文件服务

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);
app.use(bodyParser());// post请求体解析

//捕获404错误，并转向错误处理中间件
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    //开发环境和生产环境展示错误信息
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);//设置响应状态吗
    res.render('error',{title:'出错啦'});//渲染模板
});

module.exports = app;