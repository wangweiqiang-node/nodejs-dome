var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var auth = require('../auth');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(function(req, res, next){
  // console.log("===========:"+__dirname)
  next();//和vue的全局router钩子函数类似
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//用户注册
router.get('/reg', auth.mustNotLogin, function(req, res, next) {
   res.render('user/reg',{title:'用户注册'});
});
router.post('/reg', auth.mustNotLogin, function(req, res, next) {
  // res.redirect('/')
  var user = req.body;
  if(user.password != user.agpassword){
    // req.session.error = '两次密码不一致';
    req.flash('error','两次密码不一致');
    return res.redirect('back'); // 返回上一个页面
  }
  delete user.agpassword;
  user.password = blogUtil.md5(user.password);
  // console.log(user.password)
  new Model('User')(user).save(function (error, data){
    if(error){
      // req.session.error = '注册失败';
      req.flash('error','注册失败');
      return res.redirect('back'); // 返回上一个页面
    }else{
      req.session.user = data;
      //flash的方式，可以写多个 类型和内容
      req.flash('success','注册成功');
      req.flash('success','欢迎光临');
      // session的方式
      // req.session.success = '注册成功！';
      // req.session.success = '欢迎光临';
      res.redirect('/'); // 返回上一个页面
    }
  });
});
//用户登陆
router.get('/login', auth.mustNotLogin, function(req, res, next) {
  res.render('user/login',{title:'用户登陆'});
});
router.post('/login', auth.mustNotLogin, function(req, res, next) {
  var user = req.body;
  if(user.username!='' || user.password!=''){
  user.password = blogUtil.md5(user.password);
  Model('User').findOne(user, function(error,data){
      if(!data){
        req.flash('error','登陆查询失败');
        return res.redirect('back'); // 返回上一个页面
      }else{
        req.session.user = data;
        req.flash('success','登陆成功');
        req.flash('success','欢迎光临');
        console.log('-----------------------')
        console.log(user)
        res.redirect('/'); // 返回上一个页面
      }
    });
  }else{
    req.flash('error','填写信息不完整');
    return res.redirect('back'); // 返回上一个页面
  }
});
//用户退出
router.get('/loginout', function(req, res, next) {
  req.session.user = null;
  // req.session.success = '退出成功！';
  req.flash('success','退出成功！');
  res.redirect('/');
});
module.exports = router;
