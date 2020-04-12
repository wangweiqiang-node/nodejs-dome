var express = require('express');
var router = express.Router();
var auth = require('../auth');
var markdown = require('markdown').markdown;
// var bodyParser = require('body-parser');
 
// 创建 application/x-www-form-urlencoded 编码解析
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
/* GET home page. */
router.get('/',auth.mustLogin, function(req, res, next) {
  // Model('Article').find({}).exec(function(error,data){
  //   data.forEach(article => {
  //      return article.content = markdown.toHTML(article.content);
  //   });
  //   res.render('index', { title: '欢迎光临我的博客',articles:data});
  // });
  //首页通过查询显示
   res.redirect('article/list/1/2');
});
router.post('/post',auth.mustLogin, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // res.end("post页面")
  res.send(req.body);
  
});

module.exports = router;
