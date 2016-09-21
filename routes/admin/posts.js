/**
 * Created by zhaobo on 2016/9/1.
 */
const express = require('express');
const router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";
var ObjectId = require('mongodb').ObjectId;

router.get('/',function(req,res,next){
    MongoClient.connect(DB_STR,function(err, db){
       if (err){
           res.send(err);
           return;
       }
        var c = db.collection('posts');
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
            }else{
                console.log(docs);
                res.render('admin/article_list',{data:docs});
            }
        });
    });
    //res.render('admin/article_list');
});

router.get('/add',function(req,res,next){
    MongoClient.connect(DB_STR,function(err, db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
            }else {
                console.log(docs);
                res.render('admin/article_add',{data:docs});
            }
        });
    });
    //res.render('admin/article_add');
});

router.get('/delete',function(req,res){
    var id = req.query.id;
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.removeOne({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err);
            }else{
                res.redirect('/admin/posts');
            }
        });

    });
});

router.post('/add',function(req,res){
    var cat = req.body.cat,
        title = req.body.title,
        summary = req.body.summary,
        status = req.body.submit,
        content = req.body.content;
    var time = new Date();
    var post = {
        "cat":cat,
        "title":title,
        "summary":summary,
        "status":status,
        "content":content,
        "time":time.toLocaleString()
    }
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.insertOne(post,function(err,result){
            if(err){
                res.send(err);
            }else{
                res.send("添加文章成功 <a href='/admin/posts'>返回文章列表</a>");
            }
        });
    });
});

module.exports = router;