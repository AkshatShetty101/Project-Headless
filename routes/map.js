var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var Map = require('../models/map');

router.post('/addState',function(request,response){
    var name = request.body.name.toString();
    var code = request.body.code.toString();
    Map.create({'name':name,'code':code},function (err,data){
        if(err)
            response.json(err);
        else {
            response.json(data);
        }
    })
});
router.post('/addDistrict',function(request,response){
    var name = request.body.name.toString();
    var dcode = request.body.dcode.toString();
    var scode = request.body.scode.toString();
    Map.findOne({'code':scode},function (err,data){
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

router.post('/addCourt',function(request,response){
    var name = request.body.name.toString();
    var ccode = request.body.ccode.toString();
    var dcode = request.body.dcode.toString();
    var scode = request.body.scode.toString();
    Map.findOne({'code' : scode},{'district':{'$elemMatch':{'code': dcode}}},function (err,data){
        if(err)
            response.json(err);
        else {
             console.log(data);
                    var j ={'name':name,'code':ccode};
                    data.district[0].court.push(j);
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

router.get('/getState',function(request,response){
    Map.find({},{"name":"1","code":"1"},function (err,data) {
        if (err)
            response.json(err);
        else {
            response.json(data);
        }
    });
});

router.post('/getDistrict',function(request,response){
    var scode = request.body.scode.toString();
    Map.find({ 'code' : scode },{'district.name':"1",'district.code':"1"},function (err,data){
        if (err)
            response.json(err);
        else {
            response.json(data[0].district);
        }
    });
});

router.post('/getCourt',function(request,response){
    var scode = request.body.scode.toString();
    var dcode = request.body.dcode.toString();
    Map.find({ 'code' : scode },{'district': { '$elemMatch': { 'code': dcode }}},function (err,data){
        if (err)
            response.json(err);
        else {
            response.json(data[0].district[0].court);
        }
    });
});

module.exports =router;