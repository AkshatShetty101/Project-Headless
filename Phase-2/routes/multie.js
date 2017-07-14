var express = require('express');
var router = express.Router();
var Horseman = require('node-horseman');
//noinspection SpellCheckingInspection
var Jimp = require("jimp");
var horseman1 =[];
var fs = require('fs');
var path = require('path');
var async = require('async');
// var memwatch = require('memwatch-next');
//var heapdump = require('heapdump');
var buffer = new ArrayBuffer(160);
var view = new DataView(buffer,0,16);
var rn = require('random-number');
var util = require('util');
var gen = rn.generator({
    min:  0
    , max:  9999
    , integer: true
});
var timestamp = require('time-stamp');
var time =[];
var code = [];
var req = require('request');
//var snapshotTaken = false,
 //   hd;
// memwatch.on('leak', function(info) {
//     console.log("leak:",info);
//     var diff = hd.end();
//     snapshotTaken = false;
//     console.log(util.inspect(diff, {showHidden:false, depth:4}));
//     heapdump.writeSnapshot(function(err, filename) {
//         console.log('dump written to', filename);
//     });
// });
// memwatch.on('stats', function(stats) {
//     console.log("stats:",stats);
//     if(snapshotTaken===false){
//         hd = new memwatch.HeapDiff();
//         snapshotTaken = true;
//     } else {
//         var diff = hd.end();
//         snapshotTaken = false;
//         console.log(util.inspect(diff, {showHidden:false, depth:4}));
//     }
// });

router.get('/a',function(request,response) {
    response.json({"number of instances":Object.keys(horseman1).length,"size":sizeof.sizeof(horseman1,true)});
});


router.get('/',function(request,response) {
    var horseman = new Horseman({timeout:3000,interval:20});
    //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
    horseman
        .open('http://services.ecourts.gov.in/ecourtindia_v5/')
        .catch(function(err){
            console.log("Unable to access site");
            return false;
        })
        .then(function(data){
            console.log(data);
            if(data===false)
                response.send({"status":"-1"});
            else
                response.send({"status":"1"});
            horseman.close();
        })
});

router.post('/',function(request,response) {
    try{

        var unique = gen().toString();
        code.push(unique);
        time.push(timestamp('HH'));
        var horseman = new Horseman({timeout:20000,interval:10});
        var x = request.body.val1.toString();
        var y = request.body.val2.toString();
        var z = request.body.val3.toString();
        var name = request.body.name.toString();
        var year = request.body.year.toString();
        //noinspection JSUnresolvedFunction
        horseman
            .viewport(3700,2800)
            .zoom(2);
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        horseman
            .open('http://services.ecourts.gov.in/ecourtindia_v5/')
            .catch(function(err){
                console.log("Unable to access site");
                horseman.close();
                return response.send({"status":"-5","html":"Unable to access site","val1" : x,"val2" :y,"val3" :z,"name":name,"year":year});
            })
            .click('div[id="leftPaneMenuCS"]')
            .wait(1000)
            .evaluate(function(x){
                //noinspection SpellCheckingInspection
                jQuery('#sess_state_code').val(x);
                //noinspection JSUnresolvedFunction
                fillDistrict();
            },x)
            .cookies()
            .then(function(data){
                console.log(data[0].value);
            })
            .waitFor(function wait1(selector){
                return jQuery(selector).children().length>1;
            },'#sess_dist_code',true)
            .evaluate(function(y){
                //noinspection SpellCheckingInspection
                jQuery('#sess_dist_code').val(y);
                //noinspection JSUnresolvedFunction
                fillCourtComplex();
            },y)
            .waitFor(function wait2(selector){
                return jQuery(selector).children().length>1;
            },'#court_complex_code',true)
            .evaluate(function(z){
                jQuery('#court_complex_code').val(z);
                //noinspection JSUnresolvedFunction
                funShowDefaultTab();
            },z)
            .evaluate(function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            .evaluate( function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            .evaluate(function(name,year){
                //noinspection SpellCheckingInspection
                jQuery('#petres_name').val(name);
                //noinspection SpellCheckingInspection
                jQuery('#rgyearP').val(year);
                jQuery('#radB').click();
            },name,year)
            .wait(15000)
            .evaluate( function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            .screenshot(unique+'.png')
            .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6,unique){
                var x="";
                jQuery(selector1).find('option').each(function(){
                    x+=" "+jQuery(this).html();
                });
                var y="";
                jQuery(selector2).find('option').each(function(){
                    y+=" "+jQuery(this).html();
                });
                var z="";
                jQuery(selector3).find('option').each(function(){
                    z+=" "+jQuery(this).html();
                });
                //noinspection JSSuspiciousNameCombination
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    code :  unique
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",unique)
            .then(function(size){
                Jimp.read(unique+".png", function (err, img) {
                    if (err) throw err;
                    img.crop(780,820,240,80)            // resize
                        .quality(100)
                        .getBuffer(Jimp.MIME_PNG,function(err,buffer){
                            var base64Image = buffer.toString('base64');
                            console.log(img.hash());
                            var x = {"img":base64Image,'code':unique};
                            console.log("'"+unique+"'");
                            horseman1["'"+unique+"'"]=horseman;
                            response.send(x);
                        });
                })
            });
    }
    catch(err)
    {
        response.json(err);
    }
});

router.post('/a',function(request,response){
    var code = request.body.code.toString();
    if(horseman1["'"+code+"'"]!==undefined)
    {
        console.log(Object.keys(horseman1["'"+code+"'"]).length);
        console.log(Object.keys(horseman1).length);
        var captcha = request.body.captcha.toString();
        console.log(captcha);
        //noinspection JSUnusedLocalSymbols,SpellCheckingInspection
        horseman1["'"+code+"'"]
            .evaluate( function(captcha){
                jQuery('#captcha').val(captcha);
            },captcha)
            .click('input[class="Gobtn"]')
            .cookies()
            // .log()
            .evaluate( function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                    //image : jQuery(selector7).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                //console.log(data);
            })
            .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6,selector7,selector8){
                // jQuery('.Gobtn').click();
                // funShowRecords('CSpartyName');
                var x="";
                jQuery(selector1).find('option').each(function(){
                    x+=" "+jQuery(this).html();
                });
                var y="";
                jQuery(selector2).find('option').each(function(){
                    y+=" "+jQuery(this).html();
                });
                var z="";
                jQuery(selector3).find('option').each(function(){
                    z+=" "+jQuery(this).html();
                });
                //noinspection SpellCheckingInspection,JSSuspiciousNameCombination
                return {
                    height : jQuery(selector1).val(),
                    height1 : jQuery(selector2).val(),
                    height2 : jQuery(selector3).val(),
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    height6 : jQuery(selector8).attr('class'),
                    height7 : jQuery('.Gobtn').attr('onclick')
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",'#captcha','#captcha_container_2')
            .then(function(data){
            })
            .screenshot('img.png')
            .wait(8000)
            .evaluate( function(selector1,selector2){
                return {
                    height : jQuery(selector1).css("display"),
                    height1 : jQuery(selector2).css("display"),
                    height2 : jQuery(selector1).children().length,
                    height3 : jQuery(selector2).children().length
                }
            },'#errSpan','#showList')
            .then(function(data){
                console.log(data);
            })
            .waitFor(function wait2(selector1,selector2){
                if(jQuery(selector1).css("display")==='block')
                {
                    return true;
                }
                else return jQuery(selector2).css("display") === 'block';
            },'#errSpan','#showList',true)
            .catch(function(err) {
                console.log("Timeout Occurred");
            })
            .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6,name,year){
                //noinspection SpellCheckingInspection
                return {
                    errmsg : jQuery(selector1).html(),
                    html : jQuery(selector2).html(),
                    height : jQuery(selector3).css("display"),
                    height1 : jQuery(selector2).css("display"),
                    val1 : jQuery(selector4).val(),
                    val2 : jQuery(selector5).val(),
                    val3 : jQuery(selector6).val(),
                    name : jQuery(name).val(),
                    year : jQuery(year).val()
                }
            },'#errSpan p','#showList','#errSpan','#sess_state_code','#sess_dist_code','#court_complex_code',"#petres_name","#rgyearP")
            .then(function(data){
                var res;
                fs.unlinkSync(code+'.png');
                if(data.height==='none' && data.height1==='none')
                {
                    res={"status":"-1","html":'do it again',val1 : data.val1,val2 : data.val2,val3 : data.val3,name : data.name,year : data.year};
                    response.json(res);
                    horseman1["'"+code+"'"].close();
                    delete horseman1["'"+code+"'"];
                }
                else
                if( data.height === 'block' &&  data.html==="" && data.errmsg==="Invalid Captcha")
                {
                    console.log('Invalid Captcha');
                    res={"status":"2","html":data.errmsg,"code":code.toString(),val1 : data.val1,val2 : data.val2,val3 : data.val3,name : data.name,year : data.year};
                    response.json(res);
                }
                else
                if(data.height === 'block' && data.html==="" && data.errmsg==="Record Not Found")
                {
                    console.log('Record Not Found');
                    res={"status":"3","html":data.errmsg,val1 : data.val1,val2 : data.val2,val3 : data.val3,name : data.name,year : data.year};
                    response.json(res);
                    horseman1["'"+code+"'"].close();
                    delete horseman1["'"+code+"'"];
                }
            })
            .evaluate( function(selector1,selector2){
                if(jQuery(selector2).css("display")==='block' && jQuery(selector1).css("display")==='none')
                {
                    var res="";
                    var i=0;
                    var final =[];
                    //noinspection SpellCheckingInspection
                    jQuery('#dispTable').find('tbody').find('tr').each(function(){
                        res=[];
                        if(jQuery(this).children().length>1)
                        {
                            i=0;
                            jQuery(this).find('td').each(function(){
                                if(i<3)
                                    res.push(jQuery(this).html());
                                i++;
                            });
                        }
                        else
                        {
                            res.push(jQuery(this).find('td').html());
                        }
                        final.push(res);
                    });
                    return final;
                }
                else return false;
            },'#errSpan','#showList')
            .then(function(data){
                if(data!==false)
                {
                    console.log('data found');
                    var d ={"status":"1","html":data,"code":code.toString(),val1 : data.val1,val2 : data.val2,val3 : data.val3,name : data.name,year : data.year};
                    response.json(d);
                }
            });
    }
    else {
        response.json("Too early");
    }
});

router.post('/refreshCaptcha',function(request,response) {
    var code = request.body.code.toString();
    console.log(request.body);
    if(horseman1["'"+code+"'"]!==undefined)
    {
        console.log("IN!!!");
        horseman1["'"+code+"'"]
            .click('a[title="Refresh Image"]')
            .click('img[src="images/refresh-btn.jpg"]')
            .wait(3000)
            .evaluate( function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            .screenshot(code+'.png')
            .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6,unique){
                var x="";
                jQuery(selector1).find('option').each(function(){
                    x+=" "+jQuery(this).html();
                });
                var y="";
                jQuery(selector2).find('option').each(function(){
                    y+=" "+jQuery(this).html();
                });
                var z="";
                jQuery(selector3).find('option').each(function(){
                    z+=" "+jQuery(this).html();
                });
                //noinspection JSSuspiciousNameCombination
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    code :  unique
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",code)
            .then(function(size){
                Jimp.read(code+".png", function (err, img) {
                    if (err) throw err;
                    img.crop(780,820,240,80)
                        .quality(100)
                        .getBuffer(Jimp.MIME_PNG,function(err,buffer){
                            var base64Image = buffer.toString('base64');
                            console.log(img.hash());
                            var x = {"img":base64Image,'code':code};
                            console.log(size);
                            console.log("'"+code+"'");
                            response.send(x);
                        });
                })
            });
    }
    else {
        console.log("OUT!!");
        response.json("Too early");
    }
});

router.post('/invalidCaptcha',function(request,response) {
    var code = request.body.code.toString();
    if(horseman1["'"+code+"'"]!==undefined)
    {
        horseman1["'"+code+"'"]
            .wait(1500)
            .evaluate( function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            .screenshot(code+'.png')
            .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6,unique){
                var x="";
                jQuery(selector1).find('option').each(function(){
                    x+=" "+jQuery(this).html();
                });
                var y="";
                jQuery(selector2).find('option').each(function(){
                    y+=" "+jQuery(this).html();
                });
                var z="";
                jQuery(selector3).find('option').each(function(){
                    z+=" "+jQuery(this).html();
                });
                //noinspection JSSuspiciousNameCombination
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    code :  unique
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",code)
            .then(function(size){

                //noinspection JSIgnoredPromiseFromCall
                Jimp.read(code+".png", function (err, img) {
                    if (err) throw err;
                    img.crop(780,820,240,80)
                        .quality(100)
                        .getBuffer(Jimp.MIME_PNG,function(err,buffer){
                            var base64Image = buffer.toString('base64');
                            console.log(img.hash());
                            var x = {"img":base64Image,'code':code};
                            console.log(size);
                            console.log("'"+code+"'");
                            response.send(x);
                        });
                })
            });
    }
    else {
        response.json("Too early");
    }
});


router.post('/view',function(request,response){
    var code = request.body.code.toString();
    var x = (parseInt(request.body.x)).toString();
    console.log(horseman1);
    if(horseman1["'"+code+"'"]!==undefined)
    {
        //noinspection JSCheckFunctionSignatures,SpellCheckingInspection
        horseman1["'"+code+"'"]
            .click('#dispTable tbody tr:nth-child('+x+') td:nth-child(4) a')
            .evaluate( function(){
                return  jQuery('#caseHistoryDiv').html();
            })
            .then(function () {
                console.log('done');
            })
            .wait(3000)
            .wait(3000)
            .waitForSelector('#shareSelect')
            .catch(function(){
                console.log("Unable to access site");
                //noinspection NodeModulesDependencies
                horseman1["'"+code+"'"].close();
                return response.send({"status":"-5","html":"Unable to access site"});
            })
            .html('#caseHistoryDiv div')
            .then(function(data){
                console.log('done');
                response.json(data);
            })

    }
    else {
        response.json("Too early");
    }
});

router.post('/release',function(request,response){
    var arr = request.body;
    var code;
    for(var i=0;i<arr.length;i++)
    {
        code = arr[i].code.toString();
        console.log(code);
        if(horseman1["'"+code+"'"]!==undefined)
        {
            console.log(code+'is released');
            horseman1["'" + code + "'"].close();
            delete horseman1["'" + code + "'"];
        }
    }
    response.json("Resources released");
});

router.get('/clean',function (request,response){
    setInterval(resourceHandler,3600000);
    response.json('done!');
});


function resourceHandler (){
    var now = parseInt(timestamp('HH'));
    var arr = [];
    console.log("dsa");
    console.log(time);
    if(time.length!==0)
    {
        console.log(time.length);
        //noinspection JSUnresolvedFunction
        async.each(code,function(data,callback) {
            var x, y,j;
            x = code.indexOf(data);
            y = time[x];
            console.log(x+"=="+data + "  " + y);
            if(parseInt(now)>=parseInt(y))
            {
                if (parseInt(now) - parseInt(y) >= 2) {
                    if(fs.existsSync(path.join(__dirname,'..\\'+code[x]+'.png')))
                        fs.unlinkSync(code[x]+'.png');
                    j ={code:data};
                    arr.push(j);
                    delete time[x];
                    delete code[x]
                }

            }
            else
            {
                y = parseInt(y)-24;
                if (parseInt(now) - parseInt(y) >= 2) {
                    j ={code:data};
                    arr.push(j);
                    delete time[x];
                    delete code[x]
                }
            }
            console.log(time.length);
            if(parseInt(x)===(parseInt(time.length)-1))
            {
                callback(arr);
            }
        },function(arr){
            console.log(arr);
            req.post('http://139.59.21.56:8000/supreme/release',{json:arr},function (err) {
                if(err)
                    throw err;
            });
            time.splice(0,arr.length);
            code.splice(0,arr.length);
        });
    }

}
module.exports = router;