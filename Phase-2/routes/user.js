var express = require('express');
var router = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
var dateformat = require('dateformat');
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
        user.searchesDuration = dateformat(date,'dd:mm:yyyy');
        if(request.body.searchType)
            user.searchType = request.body.searchType;
        else
            user.searchesNumber = request.body.searchesNumber;
        user.save(function(err,user){
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

router.post('/changePassword',function(request,response){
    User.findOne({"username":request.body.username},function(err,data){
        if(!data)
            response.json('Incorrect Username!');
        else
        {
            data.setPassword(request.body.password,function(err,result){
                if(err)
                    response.json(err);
                else
                {
                    data.save(function(err,user){
                        if(err)
                            throw err;
                        else
                        {
                            //console.log(user);
                            passport.authenticate('local')(request, response, function () {
                                response.status(200).json({status: 'Password Change Successful!'});
                            });
                        }
                    });
                }
            })
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
            response.json("Unauthorized");
        }
        else
        if (user.logged===true) {
            response.json("Already logged in");
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
                            response.status(200).json({
                                status: 'Login successful!',
                                token: t
                            });
                        }
                    });
                }
            });
        }
    })(request,response,next);
});

router.post('/d',Verify.verifyLoggedUser,function (request,response) {
    response.json('Reached!');
});
module.exports = router;
