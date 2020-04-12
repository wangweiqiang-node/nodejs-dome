var express = require('express');
var router = express.Router();
var auth = require('../auth');
var markdown = require('markdown').markdown;
var path = require('path');
var multer = require('multer');// 用于文件上传 -- 避免全局使用
// var upload = multer({ dest: './public/uploads/' });
// 更改文件名和存储路径
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

router.get('/add', auth.mustLogin, function(req, res, next) {
  res.render('article/add', { title: '发表文章', article:{} });
});
router.post('/add', auth.mustLogin, upload.single('img'), function(req, res, next) {
  var article = req.body;
  if(req.file){//上传了文件
    article.img = path.join('/uploads',req.file.filename);
  }
  var _id = req.body._id;
  if(_id){// 有值即是修改
    var updataD = {
      title: article.title,content:article.content
     };
     if(article.img){
      updataD.img = article.img;
     }
    Model('Article').findByIdAndUpdate(_id,{$set:updataD},function(error,data){
      if(error){
        req.flash('error','文章更新失败');
        return res.redirect('back'); // 返回上一个页面
      }else{
        res.redirect('/article/detail/'+_id); // 详情页面
      }
    });
  }else{// 新增
      var user = req.session.user;
      article.user = user._id;
      new Model('Article')(article).save(function (error, data){
        if(error){
          req.flash('error','文章发表失败');
          return res.redirect('back'); // 返回上一个页面
        }else{
          // console.log(data);
          req.flash('success','文章发表成功');
          res.redirect('/'); // 返回首页面
        }
      });
   }
});
// 详情
router.get('/detail/:_id', function(req, res, next){
  var id = req.params._id;
  Model('Article').findById(id, function(error,data){
     if(error && !data){
      req.flash('error','文章查找失败');
      return res.redirect('back'); // 返回上一个页面
    }else{
     data.content = markdown.toHTML(data.content);
     res.render('article/detail', {title: '详情', article: data });
    }
  });
});
// 编辑
router.get('/edit/:_id', function(req, res, next){
  var id = req.params._id;
  Model('Article').findById(id, function(error,data){
     if(error && !data){
      req.flash('error','文章编辑失败');
      return res.redirect('back'); // 返回上一个页面
    }else{
     res.render('article/add', {title: '详情', article: data });
    }
  });
});
// 删除
router.get('/delete/:_id', function(req, res, next){
  var id = req.params._id;
  Model('Article').findByIdAndRemove(id, function(error,data){
     if(error && !data){
      req.flash('error','文章删除失败');
      return res.redirect('back'); // 返回上一个页面
    }else{
      res.redirect('/');
    }
  });
});

// 查询列表
router.get('/list/:pageNumber/:pageSize', function(req, res, next) {
  var query = {};
    if(req.query.keyword){
        query.title = new RegExp(req.query.keyword,'i');
    }

  var pageSize = parseInt(req.params.pageSize);//每页数量
  var pageNumber = parseInt(req.params.pageNumber);//第几页
    Model('Article').count(query, function(error,count){
      Model('Article').find(query).skip((pageNumber-1)*pageSize).limit(pageSize).sort({CreateTime:-1}).populate('user').exec(function(error,data){
        if(data.length == 0){
         req.flash('error','文章查询失败');
         return res.redirect('back'); // 返回上一个页面
       }else{
            data.forEach(article => {
              return article.content = markdown.toHTML(article.content);
             });
          res.render('index', { title: '',
                                articles:data,
                                keyword:req.query.keyword,
                                pageNumber:pageNumber,
                                pageSize:pageSize,
                                totalPage:Math.ceil(count/pageSize)
        });
       }
     });
    });
});
module.exports = router;
