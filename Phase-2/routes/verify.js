var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
var express = require('express');
var User= require('../models/user');

exports.getToken = function(user) {
    console.log("Success!!!!"+user+"   \n"+user);
    return jwt.sign({data:user},config.secretKey,{
    });
};
exports.verifyUsername = function(request, response, next) {
    console.log(request.body);
    User.find({username:request.body.username},function (err, data) {
        if(data[0]===undefined)
            next();
        else {
            response.json({status:-1, message:"Username is already used"});
        }
    });
};

exports.verifyLoggedUser = function(request, response, next) {
    // check header or url parameters or post parameters for token
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                decoded = jwt.decode(token);
                User.findByIdAndUpdate(decoded.data._id, {$set: {"logged": false}}, {new: true}, function (error, new_data) {
                    if (error)
                        throw error;
                    else {
                        response.json(err);
                    }
                });
            }
            else
            {
                next();
            }
        });
    }
    else
    {
        var err = new Error('No token provided!');
        response.json(err);
    }
};

exports.verifyAdmin = function(request, response, next) {

    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                response.json(err);
            }
            else
            {
                console.log(decoded);
                // if everything is good, save to request for use in other routes
                if(decoded.data.admin===false)
                {
                    response.json("Not an Administrator");
                }
                else
                    next();
            }
        });
    }
    else
    {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        response.json(err);
    }
};