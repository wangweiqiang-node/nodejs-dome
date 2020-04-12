var setings = require('../seting.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId; //Types是枚举  类型比较多
mongoose.connect(setings.dbUrl);
console.log('url:'+setings.dbUrl)
mongoose.connection.on("error",function(error){
console.log("数据库链接失败:" + error) })
mongoose.connection.on("open",function(error){
console.log("数据库链接成功") })

mongoose.model('User', new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    LoginTime : { type: Date, default: Date.now },
    email:{tyoe:String,default:''} 
}))

mongoose.model('Article', new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    CreateTime : { type: Date, default: Date.now },
    img:{ type: String, default:''},
    auth:{type:ObjectId,ref:'User'}
}))

global.Model = function(type){
    return mongoose.model(type);
} 