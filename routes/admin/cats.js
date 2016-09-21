/**
 * Created by zhaobo on 2016/8/31.
 */
const express = require('express');
const router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";
var ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if(err) {
                res.send(err);
            }else{
                res.render('admin/category_list',{data:docs});    //res.render('admin/category_list');
                //res.render('admin/category_list');
            }
        });
    });
    //res.render('admin/category_list');
});

router.get('/add', function(req, res, next) {
    res.render('admin/category_add');
});

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            res.render('admin/category_edit',{data:docs[0]});
        });
    });
    //res.render('admin/category_edit');
});

router.get('/delete',function(req, res){
    var id = req.query.id;

    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.removeOne({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err);
            }else{
                res.redirect('/admin/cats');
            }
        });
    });
});

router.post('/add',function(req, res) {
    var title = req.body.title;
    var sort = req.body.sort;
    console.log(title,sort);
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }

        var c = db.collection('cats');
        c.insertOne({title:title,sort:sort}, function (err,result) {
            if(err){
                res.send(err);
            }else{
                res.send("添加分类成功<a href='/admin/cats'>查看列表</a>");
            }
        });
    });

});
router.post('/edit',function(req,res){
    var id = req.body.id,
        title = req.body.title,
        sort = req.body.sort;
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        console.log(id,title,sort);
        var c = db.collection('cats');
        c.updateOne({_id:ObjectId(id)},{$set:{title:title,sort:sort}},function(err,result){
            if(err){
                res.send(err);
            }else{
                res.send("修改成功<a href='/admin/cats'>返回列表</a>");
            }
        });
    });
});

module.exports = router;
