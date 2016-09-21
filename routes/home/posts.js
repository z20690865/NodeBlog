/**
 * Created by zhaobo on 2016/8/31.
 */
var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";
var ObjectId = require('mongodb').ObjectId;

/* GET users listing. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    MongoClient.connect(DB_STR,function(err,db){
        var c = db.collection('posts');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
            }else{
                res.render('home/article',{data:docs});
            }
        });
    });
});

module.exports = router;
