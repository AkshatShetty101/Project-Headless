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

module.exports =router;