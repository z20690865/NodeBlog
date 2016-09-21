var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(DB_STR,function(err, db){
    if(err){
      res.send(err);
      return;
    }
    var c1 = db.collection('posts');

    c1.find({status:'已发布'}).toArray(function(err,docs1){
      if(err){
        res.send(err);
        return;
      }else{
        var c2 = db.collection('cats');
        c2.find().toArray(function(err,docs2){
          if(err){
            res.send(err);
            return;
          }else{
            res.render('home/index',{data1:docs1,data2:docs2});
          }
        });
      }
    });

  });
});

router.get('/list',function(req,res){
  var cat = req.query.cat;

  MongoClient.connect(DB_STR,function(err,db){
    if(err){
      res.send(err);
      return;
    }
    var c1 = db.collection('posts');
    c1.find({$and:[{status:'已发布'},{cat:cat}]}).toArray(function(err,docs1){
      if(err){
        res.send(err);
        return;
      }else{
        var c2 = db.collection('cats');
        c2.find().toArray(function(err,docs2){
          if(err){
            res.send(err);
            return;
          }else{
            res.render('home/index',{data1:docs1,data2:docs2});
          }
        });
      }
    });
  });
});

module.exports = router;
