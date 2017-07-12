var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var Map = require('../models/map');
var lineReader = require('readline');
var async = require('async');
var _ = require('underscore');

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

router.post('/getNames',function(request,response){
    //noinspection SpellCheckingInspection
    var scode = request.body.val1.toString();
    //noinspection SpellCheckingInspection
    var dcode = request.body.val2.toString();
    //noinspection SpellCheckingInspection
    var ccode = request.body.val3.toString();
    Map.find({ 'code' : scode },{'name':"1",'district': { '$elemMatch': { 'code': dcode }}},function (err,data){
        if (err)
            response.json(err);
        else {
            //noinspection SpellCheckingInspection
            var sname = data[0].name;
            console.log(sname);
            //noinspection SpellCheckingInspection
            var dname = data[0].district[0].name;
            console.log(dname);
             //noinspection SpellCheckingInspection
            //var cname;
            async.each(data[0].district[0].court,function(data,callback){
                if(data.code === ccode){
                    callback(data.name);
                }
            },function (data){
                console.log({'sname':sname,'dname':dname,'cname':data});
                response.json({'sname':sname,'dname':dname,'cname':data});
            });
  //          var d =  _.findWhere(data[0].district[0].court,{code : ccode});

            //noinspection SpellCheckingInspection
        }
    });
});

//noinspection SpellCheckingInspection

router.get('/getState',function(request,response){
    Map.find({},{"name":"1","code":"1"}).collation({locale:'en',strength: 2}).sort({name:1}).then(function (data,err) {
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
        if(ct===0)
        {
            scode = line;
        }
        else
        if (ct===1)
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

//noinspection SpellCheckingInspection
router.get('/adddt',function(request,response) {
    var splitString4=[];
    var a =lineReader.createInterface({
        input: fs.createReadStream('./a.txt')
    });
    var ct=0;
    //noinspection SpellCheckingInspection
    var scode;
    a.on('line', function (line) {
        if(ct%2===0)
        {
            scode = line;
        }
        else
        {
            var values=line.split(/"(.*?)"/gim);
            splitString4 = line.split(/([^<>]+)<\/option>/gi);
            splitString4.pop();
        }
        if(ct%2===1)
            handleResultsDistrict(values,splitString4,scode,response);
        ct++;
    });
    response.json("done");
});



//noinspection SpellCheckingInspection
router.get('/adct',function(request,response) {
    var splitString4=[];
    var a =lineReader.createInterface({
        input: fs.createReadStream('./a.txt')
    });
    var ct=0;
    //noinspection SpellCheckingInspection
    var scode,dcode;
    a.on('line', function (line) {
        if(line!=="EOF")
        {
            if(ct%3===0)
            {
                scode = line;
            }
            if(ct%3===1)
            {
                dcode = line;
            }
            else
            {
                var values=line.split(/"(.*?)"/gim);
                splitString4 = line.split(/([^<>]+)<\/option>/gi);
                splitString4.pop();
            }
            if(ct%3===2)
                handleResultsCourt(values,splitString4,scode,dcode,response);
            ct++;
        }

    });
    response.json("done");
});

function handleResultsDistrict(values,splitString4,scode,response){
    var arr = [];
    //noinspection JSUnresolvedFunction
    async.each(values,function(data,callback){
        var x,y;

        x= values.indexOf(data);
        if(x%2===1) {
            y= splitString4[x];
            var j ={'name':y,'code':data};
            arr.push(j);
        }
        if(x===(values.length-1))
            callback(arr);
    },function(arr){
        Map.findOne({'code' : scode},function (err,data) {
            if (err)
                response.json(err);
            else {
                console.log(data);
                data.district=arr;
                data.save(function(err){
                    if(err)
                        response.json(err);
                });

            }
        });

    })

}

function handleResultsCourt(values,splitString4,scode,dcode,response){
    //console.log(values.length);
    var arr = [];
    //noinspection JSUnresolvedFunction
    async.each(values,function(data,callback){
        var x,y;
        x= values.indexOf(data);
        if(x%2===1) {
            y= splitString4[x];
            //  console.log("outside:"+data+"   "+y);
            var j ={'name':y,'code':data};
            arr.push(j);
        }
        if(x===(values.length-1))
            callback(arr);
    },function(arr){
        // console.log(arr);
        Map.findOne({'code' : scode},{'district':{'$elemMatch':{'code': dcode}}},function (err,data){
            if (err)
                response.json(err);
            else {
                console.log(scode+"----"+dcode);
                console.log(data);
                data.district[0].court=arr;
                data.save(function(err){
                    if(err)
                        response.json(err);
                });

            }
        });

    })
}

router.get('/add',function(request,response) {
    var splitString4=[];
    var a =lineReader.createInterface({
        input: fs.createReadStream('./a.txt')
    });
    var ct=0;
    var scode;
    a.on('line', function (line) {
        if(ct===0)
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