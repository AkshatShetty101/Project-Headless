var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var Map = require('../models/map');
var lineReader = require('readline');

router.get('/addStatePage',function(request,response){
    var link="../public/html/addState.html";
    link = path.join(__dirname,link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});

router.get('/addDistrictPage',function(request,response){
    var link='../public/html/addDistrict.html';
    link = path.join(__dirname,link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});

router.get('/addCourtPage',function(request,response){
    var link='../public/html/addCourt.html';
    link = path.join(__dirname,link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});

router.post('/addState',function(request,response){
    console.log(request.body);
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

router.post('/deleteCourts',function(request,response){
    var dcode = request.body.dcode.toString();
    var scode = request.body.scode.toString();
    Map.findOne({'code' : scode},{'district':{'$elemMatch':{'code': dcode}}},function (err,data){
        if(err)
            response.json(err);
        else {
            console.log(data);
            data.district[0].court=[];
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

router.get('/adc',function(request,response) {
    var splitString4=[];
    var a =lineReader.createInterface({
        input: fs.createReadStream('./a.txt')
    });
    var ct=0;
    var scode;
    var dcode;
    a.on('line', function (line) {
        if(ct==0)
        {
            scode = line;
        }
        else
        if (ct==1)
        {
            dcode = line;
        }
        else
        {
            Map.findOne({'code' : scode},{'district':{'$elemMatch':{'code': dcode}}},function (err,data){
                if(err)
                    response.json(err);
                else {
                    console.log('Line from file:', line);
                    splitString4 = line.split(/\s*>\s*/);
                    console.log(splitString4[1]);
                    console.log(scode);
                    console.log(dcode);
                    console.log(data);
                    var j ={'name':splitString4[1],'code':splitString4[0]};
                    data.district[0].court.push(j);
                    data.save(function(err,result){
                        if(err)
                            response.json(err);
                        else
                        {
                            console.log(result);
                        }
                    });
                }
            });
        }
        ct++;
    });
    response.json('done');
});

router.get('/g',function(request,response) {
    var splitString4=[];
    var a =lineReader.createInterface({
        input: fs.createReadStream('./a.txt')
    });
    var ct=0;
    var scode;
    a.on('line', function (line) {
        if(ct==0)
        {
            scode = line;
        }
        else
        {
                    console.log('Line from file:', line);
                    // splitString4 = line.split(/([>])(?:(?=(\\?))\2.)*?\1/);
                    splitString4 = line.split(/>^\s*>/);
                    console.log(splitString4);

        }
        ct++;
    });
    response.json('done');
});

router.get('/add',function(request,response) {
    var splitString4=[];
    var a =lineReader.createInterface({
        input: fs.createReadStream('./a.txt')
    });
    var ct=0;
    var scode;
    a.on('line', function (line) {
        if(ct==0)
        {
            scode = line;
        }
        else
        {
            Map.findOne({'code' : scode},function (err,data){
                if(err)
                    response.json(err);
                else {
                    console.log('Line from file:', line);
                    splitString4 = line.split(/\s*>\s*/);
                    console.log(splitString4[1]);
                    console.log(scode);
                    console.log(data);
                    var j ={'name':splitString4[1],'code':splitString4[0]};
                    data.district.push(j);
                    data.save(function(err,result){
                        if(err)
                            response.json(err);
                        else
                        {
                            console.log(result);
                        }
                    });

                }
            });
        }
        ct++;
    });
    response.json('done');
});
module.exports =router;