// 检测必须登陆 不登陆就跳转到登陆页
exports.mustLogin = function(req,res,next){
    if(req.session.user){
        next()
    }else{
        req.flash('error','你尚未登陆，请登陆')
        res.redirect('/users/login')
    }
}

//  检测必须未登陆 已登陆的话直接跳转到首页
exports.mustNotLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','你已登陆，欢迎您_v_')
        res.redirect('/')
    }else{
      next()
    }
}