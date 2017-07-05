var express = require('express');
var router = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
var dateformat = require('dateformat');
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Verify = require('./verify');
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

router.post('/register',Verify.verifyUsername,function(request, response){
    console.log("in!");
    User.register(new User({ username : request.body.username }),request.body.password,function(err, user){
        var date = new Date();
        date.setMonth(date.getMonth()+parseInt(request.body.searchesDuration));
        user.searchesDuration = dateformat(date,'dd-mm-yyyy');
        if(request.body.searchType)
            user.searchType = request.body.searchType;
        else
            user.searchesNumber = request.body.searchesNumber;
        user.save(function(err){
            if(err)
                throw err;
            else
            {
                //console.log(user);
                passport.authenticate('local')(request, response, function () {
                    response.status(200).json({status: 'Registration Successful!'});
                });
            }
        });
    });
});

router.get('/get',Verify.verifyLoggedUser,Verify.verifyAdmin,function (request,response){
    User.find({},{_id:0,updatedAt:0,createdAt:0,__v:0,logged:0},function(err,data){
        if(err)
            response.json(err);
        else
        {
            response.json(data);
        }

    });
});

router.post('/changePassword',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    User.findById(decoded.data._id,function(err,data){
        if(!data)
            response.json('Incorrect Username!');
        else
        {
            data.setPassword(request.body.password,function(err){
                if(err)
                    response.json(err);
                else
                {
                    data.save(function(err,user){
                        if(err)
                            response.json(err);
                        else
                        {
                            console.log(user);
                            response.json('success!');
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
    User.findone({username: username},function(err,data){
        if(!data)
            response.json('Incorrect Username!');
        else
        {
            data.setPassword(password,function(err){
                if(err)
                    response.json(err);
                else
                {
                    data.save(function(err,user){
                        if(err)
                            response.json(err);
                        else
                        {
                            console.log(user);
                            response.json('success!');
                        }
                    });
                }
            })
        }
    });
});

router.post('/removeUser',Verify.verifyLoggedUser,Verify.verifyAdmin,function(request,response) {
    console.log('Here!!');
    User.findOne({'username': request.body.username}, function (err, data) {
        if (err)
            response.json(err);
        else
        if (!data)
            response.json('No such user!!');
        else
        {
            console.log(data);
            if(data.admin===true)
            {
                response.json('Cannot delete admin!');
            }
            else
            {
                data.remove(function (err) {
                    if (err)
                        response.json(err);
                    else {
                        response.json('success!!');
                    }
                });
            }
        }
    });
});

router.get('/findStatus',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    console.log(decoded.data._id);
    var flag=-1;
    User.findById(decoded.data._id,function(err,data){
        if(err)
            response.json(err);
        else
        {
            var date = new Date();
            console.log(date);
            var x= data.searchesDuration.split(/[-]/);
            console.log(x);
            console.log(date.getFullYear()+"--"+(date.getMonth()+1+"--"+(date.getDate())));
            console.log(x[1]);
            if(parseInt(x[2])===parseInt(date.getFullYear()))
            {
                if(parseInt(x[1])>(parseInt(date.getMonth())+1))
                {
                    flag=1;
                    return data;
                }
                else
                if(parseInt(x[1])===(parseInt(date.getMonth())+1)) {
                    if (parseInt(x[1]) >= (parseInt(date.getDate()) + 1)) {
                        flag = 1;
                        return data;
                    }
                    else {
                        return data;
                    }
                }
                else
                    return data;
            }
            else
            if(parseInt(x[2])>parseInt(date.getFullYear()))
            {
                flag=1;
                return data;
            }
            else
            {
                return data;
            }

        }
    }).then(function (data) {
        console.log(data.logged);
        console.log('here!!!!!!!!!'+flag);
        if(flag===1)
        {
            if(data.searchType===true)
            {
                response.json({status: 2, message: 'Unlimited searches left'});
            }
            else
            {
                response.json({status: 1, message: 'Limited searches left', amount: data.searchesNumber});
            }
        }
        else {
            response.json({status: -1, message: 'Time Period expired. Contact Administrator'})
        }
    });
});

router.post('/decreaseSearches',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    var num = parseInt(request.body.number);
    User.findById(decoded.data._id,function(err,data){
        if(err)
            response.json(err);
        else
        if(!data)
            response.json({status: -1, message: 'No such user'});
        else
        {
            if(data.searchType===true)
            {
                response.json({status:1, message: 'Deducted from infinity'});
            }
            else
            {
                data.searchesNumber = parseInt(data.searchesNumber)- num;
            }
            data.save(function(err,user){
                if(err)
                    response.json(err);
                else
                {
                    console.log(user);
                    response.json({status: 1,message: 'Deducted appropriately'});
                }
            });
        }
    });
});

router.post('/updateStatus',Verify.verifyLoggedUser,Verify.verifyAdmin,function(request,response){
    var username = request.body.username;
    var searchType = request.body.searchType;
    var searchesDuration = parseInt(request.body.searchesDuration);
    var searchesNumber = parseInt(request.body.searchesNumber);
    User.findOne({username: username},function(err,data) {
        if (err)
            response.json(err);
        else
        {
            var date = new Date();
            console.log(date);
            date.setMonth(date.getMonth()+searchesDuration);
            console.log(date);
            data.searchesDuration = dateformat(date,'dd-mm-yyyy');
            if(searchType==='true')
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
                    response.json(err);
                else
                {
                    console.log(user);
                    response.json({status: 1,message: 'Status reset'});
                }
            });
        }
    });
});

router.post('/login',function(request, response,next){
    passport.authenticate("local",function(err,user){
        console.log(user);
        if (err) {
            response.status(500).json({err: err});
        }
        else
        if (!user) {
            console.log("false user");
            response.json({status: -1, message: 'Incorrect username and password combination'});
        }
        else
        if (user.logged===true) {
            response.json({status: -2, message: 'Already logged in'});
        }
        else
        {

            console.log("In");
            request.logIn(user, function (err) {
                if (err) {
                    response.status(500).json({err: 'Could not log in user'});
                }
                else
                {
                    user.logged = true;
                    user.save(function (err, new_data) {
                        if (err)
                            response.json(err);
                        else {
                            console.log(new_data);
                            var t = Verify.getToken(user);
                            console.log("Success!!!!" + user.admin + "   \n" + user);
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
    decoded.data.logged = false;
    console.log(decoded.data);
    User.findByIdAndUpdate(decoded.data._id,{$set : {logged: decoded.data.logged}},{ new : true},function(error,new_data){
        if(error)
            response.json(error);
        else
        {
            console.log(new_data);
            request.logout();
            response.status(200).json({
                status: 'Bye!'
            });
        }
    });
});

router.post('/d',Verify.verifyLoggedUser,function (request,response) {
    response.json('Reached!');
});
module.exports = router;
