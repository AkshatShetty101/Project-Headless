var express = require('express');
var router = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
//noinspection SpellCheckingInspection
var dateformat = require('dateformat');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Verify = require('./verify');
var moment = require('moment');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/addUser',function(request,response){
    var link="../public/html/addUser.html";
    link = path.join(__dirname,link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});

router.post('/registerAdmin',Verify.verifyUsername,Verify.verifySuper,function(request, response){
    //console.log("in!");
    User.register(new User({ username : request.body.username }),request.body.password,function(err, user){
        user.searchesDuration = '06-07-2016';
        user.searchType = false;
        user.searchesNumber = 0;
        user.admin = true;
        user.save(function(err){
            if(err)
                throw err;
            else
            {
                console.log("Admin!");
                passport.authenticate('local')(request, response, function () {
                    response.status(200).json({status: '1' ,message: 'Registration Successful!'});
                });
            }
        });
    });
});

router.post('/removeAdmin',Verify.verifyLoggedUser,Verify.verifySuper,function(request, response){
    User.findOne({'username': request.body.username}, function (err, data) {
        if (err)
            response.status(200).json(err);
        else
        if (!data)
            response.status(200).json('No such admin!!');
        else
        {
            data.remove(function (err) {
                if (err)
                    response.status(200).json(err);
                else {
                    response.status(200).json('success!!');
                }
            });
        }
    });
});



router.post('/register',Verify.verifyUsername,Verify.verifyLoggedUser,function(request, response){
    console.log("in!");
    User.register(new User({ username : request.body.username }),request.body.password,function(err, user){
        var x = request.body.searchesDuration.split(/[-]/);
        user.searchesDuration = (x[2]+'-'+x[1]+'-'+x[0]).toString();
        if(request.body.searchType)
            user.searchType = request.body.searchType;
        else
            user.searchesNumber = request.body.searchesNumber;
        user.save(function(err){
            if(err)
                throw err;
            else
            {
                passport.authenticate('local')(request, response, function () {
                    response.status(200).json({status: '1' ,message: 'Registration Successful!'});
                });
            }
        });
    });
});

router.get('/get',Verify.verifyLoggedUser,Verify.verifyAdmin,function (request,response){
    User.find({admin:{$ne: true}, super:{$ne: true} ,username:{$ne: 'deleted'}},{_id:0,updatedAt:0,createdAt:0,__v:0,logged:0}).sort({username:1}).then(function (data,err) {
        if(err)
            response.status(200).json(err);
        else
        {
            response.status(200).json(data);
        }

    });
});

router.get('/getAdmin',Verify.verifyLoggedUser,Verify.verifySuper,function (request,response){
    User.find({admin: true, super:{$ne: true}},{_id:0,updatedAt:0,createdAt:0,__v:0,logged:0}).sort({username:1}).then(function (data,err) {
        if(err)
            response.status(200).json(err);
        else
        {
            response.status(200).json(data);
        }
    });
});

router.post('/changePassword',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    User.findById(decoded.data._id,function(err,data){
        if(!data)
            response.status(200).json('Incorrect Username!');
        else
        {
            data.setPassword(request.body.password,function(err){
                if(err)
                    response.status(200).json(err);
                else
                {
                    data.save(function(err,user){
                        if(err)
                            response.status(200).json(err);
                        else
                        {
                            console.log(user.username);
                            response.status(200).json('success!');
                        }
                    });
                }
            })
        }
    });
});

router.post('/superChangePassword',Verify.verifyLoggedUser,Verify.verifySuper,function(request,response){
    var username = request.body.username;
    var password = request.body.password;
    User.findOne({username: username},function(err,data){
        if(!data)
            response.status(200).json('Incorrect Username!');
        else
        {
            data.setPassword(password,function(err){
                if(err)
                    response.status(200).json(err);
                else
                {
                    data.save(function(err,user){
                        if(err)
                            response.status(200).json(err);
                        else
                        {
                            console.log(user.username);
                            response.status(200).json('success!');
                        }
                    });
                }
            })
        }
    });
});

router.post('/adminChangePassword',Verify.verifyLoggedUser,Verify.verifyAdmin,function(request,response){
    var username = request.body.username;
    var password = request.body.password;
    User.findOne({username: username},function(err,data){
        if(!data)
            response.status(200).json('Incorrect Username!');
        else
        {
            data.setPassword(password,function(err){
                if(err)
                    response.status(200).json(err);
                else
                {
                    data.save(function(err,user){
                        if(err)
                            response.status(200).json(err);
                        else
                        {
                            console.log(user.username);
                            response.status(200).json('success!');
                        }
                    });
                }
            })
        }
    });
});

router.get('/findMe',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
//    console.log(decoded.data._id);
    User.findById(decoded.data._id,{_id:0,updatedAt:0,createdAt:0,__v:0,logged:0,super:0,admin:0}).then(function(data,err){
        if(err)
            response.status(200).json(err);
        else {
            response.status(200).json(data);
        }
    });
});

router.post('/removeUser',Verify.verifyLoggedUser,Verify.verifyAdmin,function(request,response) {
    console.log('Here!!');
    var flag= -1;
    User.findOne({'username': request.body.username}).then(function (data, err) {
        if (err) {
            response.status(200).json(err);
            return data;
        }
        else if (!data) {
            response.status(200).json('No such user!!');
            return data;
        }
        else {
  //          console.log(data);
            if (data.admin === true) {
                response.status(200).json('Cannot delete admin!');
                return data;
            }
            else {
                flag = 1;
                return data;
            }
        }
    }).then(function (data) {
        if(flag===1)
        {
            User.findOne({'username': 'deleted'},function (err,new_d){
                if(err)
                    response.status(200).json(err);
                else
                {
                    new_d.total = new_d.total + data.total;
                    new_d.save(function (err) {
                        if(err)
                            response.status(200).json(err);
                        else
                        {
                            data.remove(function (err) {
                                if (err)
                                    response.status(200).json(err);
                                else {
                                    response.status(200).json('success!!');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/findStatus',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    //console.log(decoded.data._id);
    var flag=-1;
    var y = -1.5;
    User.findById(decoded.data._id).then(function(data,err){
        if(err)
            response.status(200).json(err);
        else {
           // console.log(data);
            var date = new Date();
            //console.log(date);
            var x = data.searchesDuration.split(/[-]/);
            //console.log(x);
            console.log(date.getFullYear() + "--" + (date.getMonth() + 1 + "--" + (date.getDate())));
            console.log("sadasdas"+y);
            var a = moment([parseInt(x[2]),(parseInt(x[1])-1),parseInt(x[0])]);
            console.log(a);
            var b = moment([date.getFullYear(),(date.getMonth()),date.getDate()]);
            console.log(b);
            y =a.diff(b, 'days');
            console.log("y:"+y);
            if(y>=0){
                return data;
            }
            else {
                response.status(200).json({status: -1, message: 'Time Period expired. Contact Administrator'});
            }
        }
    }).then(function (data) {
      //  console.log(data.logged);
        console.log('here!!!!!!!!!');
        if(data.searchType===true)
        {
            response.status(200).json({status: 2, message: 'Unlimited searches left'});
        }
        else
        {
            response.status(200).json({status: 1, message: 'Limited searches left', amount: data.searchesNumber});
        }
    });
});

router.post('/decreaseSearches',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    var num = parseInt(request.body.number);
    User.findById(decoded.data._id,function(err,data){
        if(err)
            response.status(200).json(err);
        else
        if(!data)
            response.status(200).json({status: -1, message: 'No such user'});
        else
        {
            if(data.searchType===true)
            {
                data.total = parseInt(data.total)+ num;
            }
            else
            {
                data.total = parseInt(data.total)+ num;
                data.searchesNumber = parseInt(data.searchesNumber)- num;
            }
            data.save(function(err,user){
                if(err)
                    response.status(200).json(err);
                else
                {
                    console.log(user.username);
                    response.status(200).json({status: 1,message: 'Deducted appropriately'});
                }
            });
        }
    });
});

router.post('/updateStatus',Verify.verifyLoggedUser,Verify.verifyAdmin,function(request,response){
    var username = request.body.username;
    var searchType = request.body.searchType;
    var searchesNumber = parseInt(request.body.searchesNumber);
    console.log(request.body);
    User.findOne({username: username},function(err,data) {
        if (err)
            response.status(200).json(err);
        else
        {
            var x = request.body.searchesDuration.split(/[-]/);
            data.searchesDuration = (x[2]+'-'+x[1]+'-'+x[0]).toString();
            if(searchType===true)
            {
                data.searchType = true;
                data.searchesNumber = 0;
            }
            else
            {
                data.searchType = false;
                data.searchesNumber = searchesNumber;
            }
            data.save(function(err,user){
                if(err)
                    response.status(200).json(err);
                else
                {
                    console.log(user.username);
                    response.status(200).json({status: 1,message: 'Status reset'});
                }
            });
        }
    });
});

router.post('/login',function(request, response,next){
    passport.authenticate("local",function(err,user){
        console.log(user.username);
        if (err) {
            response.status(500).json({err: err});
        }
        else
        if (!user) {
            console.log("false user");
            response.status(200).json({status: -1, message: 'Incorrect username and password combination'});
        }
        else
        if (user.logged===true) {
            response.status(200).json({status: -2, message: 'Already logged in'});
        }
        else
        {
            request.logIn(user, function (err) {
                if (err) {
                    response.status(500).json({err: 'Could not log in user'});
                }
                else
                {
                    user.logged = true;
                    user.save(function (err, new_data) {
                        if (err)
                            response.status(200).json(err);
                        else {
                            var t = Verify.getToken(user);
                            console.log("Success!!!!");
                            if(new_data.super===true && new_data.admin===true)
                            {
                                response.status(200).json({
                                    status: 3,
                                    message:'Login Successful',
                                    token: t
                                });
                            }
                            else
                            if(new_data.admin===true)
                            {
                                response.status(200).json({
                                    status: 2,
                                    message:'Login Successful',
                                    token: t
                                });
                            }
                            else
                            {
                                response.status(200).json({
                                    status: 1,
                                    message:'Login Successful',
                                    token: t
                                });
                            }

                        }
                    });
                }
            });
        }
    })(request,response,next);
});

router.get('/logout',Verify.verifyLoggedUser,function(request, response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    User.findByIdAndUpdate(decoded.data._id,{$set : {logged: false}},{ new : true},function(error,new_data){
        if(error)
            response.status(200).json(error);
        else
        {
            console.log(new_data.username);
            request.logout();
            response.status(200).json({
                status: 'Bye!'
            });
        }
    });
});

router.post('/d',Verify.verifyLoggedUser,function (request,response) {
    response.status(200).json('Reached!');
});

router.get('/total',function (request,response) {
    User.find({},function (err,data) {
        var groups = _.pluck(data,'total');
        var sum = _.reduce(groups, function(memo, num){
            return memo + num; }, 0);
        response.status(200).json({searches: sum});
    });
});
module.exports = router;