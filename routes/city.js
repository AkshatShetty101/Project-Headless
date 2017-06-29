var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var City = require('../models/city');
var lineReader = require('readline');
var async = require('async');
var _ = require('underscore');

router.post('/addCity',function(request,response){
    console.log(request.body);
    var cname = request.body.cname.toString();
    var sname = request.body.sname.toString();
    var code = request.body.code.toString();
    City.create({'cname':cname,'sname':sname,'code':code},function (err,data){
        if(err)
            response.json(err);
        else {
            response.json(data);
        }
    });
});

router.post('/addDistrict',function(request,response){
    var name = request.body.name.toString();
    var dcode = request.body.dcode.toString();
    var cname = request.body.cname.toString();
    City.findOne({'cname': cname},function (err,data){
        if(err)
            response.json(err);
        else {
            var j ={'name':name,'code':dcode};
            data.district.push(j);
            data.save(function(err,result){
                if(err)
                    response.json(err);
                else
                {
                    console.log(result);
                    response.json(data);
                }
            });
        }
    });
});


module.exports =router;