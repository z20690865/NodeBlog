var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";

/* GET users listing. */
router.use('/login',checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

router.get('/logout', function(req, res){
  req.session.isLogin = null;
  res.redirect('/admin/index');
});

router.post('/signin', function(req,res,next){
  var username = req.body.username,
      pswd = req.body.pswd;
  MongoClient.connect(DB_STR,function(err,db){
    if(err){
      res.send(err);
      return;
    }
    var c = db.collection('users');
    c.find({username:username,pswd:pswd}).toArray(function(err,docs){
      if(err){
        res.send(err);
        return;
      }

      if(docs.length){
        req.session.isLogin = true;
        res.redirect('/admin/index');
      }else{
        res.redirect('/users/login');
      }


    });
  });
});
function checkNotLogin(req, res, next){
  if(req.session.isLogin){
    res.redirect('/admin/index');
  }
  next();
}
module.exports = router;
