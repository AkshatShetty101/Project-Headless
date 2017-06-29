var express = require('express');
var router = express.Router();
var Horseman = require('node-horseman');
var Jimp = require("jimp");
var horseman1 =[];
var fs = require('fs');
var async = require('async');
var buffer = new ArrayBuffer(160);
var view = new DataView(buffer,0,16);
var rn = require('random-number');
var gen = rn.generator({
    min:  0
    , max:  9999
    , integer: true
});
var timestamp = require('time-stamp');
var time =[];
var code = [];
var req = require('request');



router.get('/',function(request,response) {
    var horseman = new Horseman({timeout:3000});
    horseman
        .open('http://services.ecourts.gov.in/ecourtindia_v5/')
        .catch(function(err){
            console.log("Unable to access site");
            return false;
        })
        .then(function(data){
            console.log(data);
            if(data==false)
                response.send({"status":"-1"});
            else
                response.send({"status":"1"});
            console.log(horseman);
            horseman.close();
        })
});

router.post('/',function(request,response) {
    try{

        var unique = gen().toString();
        console.log(unique);
        code.push(unique);
        time.push(timestamp('mm'));
        var horseman = new Horseman({timeout:20000});
        var x = request.body.val1.toString();
        var y = request.body.val2.toString();
        var z = request.body.val3.toString();
        var name = request.body.name.toString();
        var year = request.body.year.toString();
        console.log(x);
        horseman
            .viewport(3700,2800)
            .zoom(2);
        console.log(Object.keys(horseman).length);
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
                jQuery('#sess_state_code').val(x);
                fillDistrict();
                return;
            },x)
            .cookies()
            .then(function(data){
                console.log(data[0].value);
            })
            .waitFor(function wait1(selector){
                return jQuery(selector).children().length>1;
            },'#sess_dist_code',true)
            .evaluate(function(y){
                jQuery('#sess_dist_code').val(y);
                fillCourtComplex();
                return;
            },y)
            .waitFor(function wait2(selector){
                return jQuery(selector).children().length>1;
            },'#court_complex_code',true)
            .evaluate(function(z){
                jQuery('#court_complex_code').val(z);
                funShowDefaultTab();
                return;
            },z)
            .evaluate(function(selector1){
                return {
                    height : jQuery(selector1).attr('src'),
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            //.screenshot('img3.png')
            //.click('a[id="CSpartyName"]')
            // .click('a[title="Refresh Image"]')
            // .click('img[src="images/refresh-btn.jpg"]')
            //.wait(2000)
            .evaluate( function(selector1){
                return {
                    height : jQuery(selector1).attr('src')
                }
            }, '#captcha_image')
            .then(function(data){
                console.log(data);
            })
            //.wait(8000)
            //.screenshot('img4.png')
            .evaluate(function(name,year){
                //jQuery('captcha_container_2')..removeClass(  ).addClass( "" );;
                //validateStateDistCourt(this.id);
                jQuery('#petres_name').val(name);
                jQuery('#rgyearP').val(year);
                jQuery('#radB').click();
                return;
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
                //jQuery('.captcha_play_button').click();
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
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    code :  unique
                    //image : jQuery(selector7).attr('src')
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
                            //console.log(size);
                            console.log("'"+unique+"'");
                            buffer[1] =horseman;
                            // console.log(buffer[1]);
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
    if(horseman1["'"+code+"'"]!=undefined)
    {
        console.log(Object.keys(horseman1["'"+code+"'"]).length);
        console.log(Object.keys(horseman1).length);
        var captcha = request.body.captcha.toString();
        //console.log(horseman1);
        console.log(captcha);
        horseman1["'"+code+"'"]
            .evaluate( function(captcha){
                jQuery('#captcha').val(captcha);
                return;
            },captcha)
            //horseman1.close();
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
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    height6 : jQuery(selector8).attr('class'),
                    height7 : jQuery('.Gobtn').attr('onclick')
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",'#captcha','#captcha_container_2')
            .then(function(data){
                //console.log(data);
            })
            .screenshot('img.png')
            .wait(8000)
            .evaluate( function(selector1,selector2){
                return {
                    height : jQuery(selector1).css("display"),
                    height1 : jQuery(selector2).css("display"),
                    height2 : jQuery(selector1).children().length,
                    height3 : jQuery(selector2).children().length,
                }
            },'#errSpan','#showList')
            .then(function(data){
                console.log(data);
            })
            .waitFor(function wait2(selector1,selector2){
                if(jQuery(selector1).css("display")=='block')
                {
                    return true;
                }
                else if(jQuery(selector2).css("display")=='block')
                {
                    return true;
                }
                else return false;
            },'#errSpan','#showList',true)
            .catch(function(err) {
                console.log("Timeout Occured");
            })
            .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6,name,year){
                return {
                    errmsg : jQuery(selector1).html(),
                    html : jQuery(selector2).html(),
                    height : jQuery(selector3).css("display"),
                    height1 : jQuery(selector2).css("display"),
                    val1 : jQuery(selector4).val(),
                    val2 : jQuery(selector5).val(),
                    val3 : jQuery(selector6).val(),
                    name : jQuery(name).val(),
                    year : jQuery(year).val(),
                }
            },'#errSpan p','#showList','#errSpan','#sess_state_code','#sess_dist_code','#court_complex_code',"#petres_name","#rgyearP")
            .then(function(data){
                var res;
                fs.unlinkSync(code+'.png');
                if(data.height=='none' && data.height1=='none')
                {
                    res={"status":"-1","html":'do it again',val1 : data.val1,val2 : data.val2,val3 : data.val3,name : data.name,year : data.year};
                    response.json(res);
                    horseman1["'"+code+"'"].close();
                    delete horseman1["'"+code+"'"];
                }
                else
                if( data.height == 'block' &&  data.html=="" && data.errmsg=="Invalid Captcha")
                {
                    console.log('Invalid Captcha');
                    res={"status":"2","html":data.errmsg,"code":code.toString()};
                    response.json(res);
                }
                else
                if(data.height == 'block' && data.html=="" && data.errmsg=="Record Not Found")
                {
                    console.log('Record Not Found');
                    res={"status":"3","html":data.errmsg};
                    response.json(res);
                    horseman1["'"+code+"'"].close();
                    delete horseman1["'"+code+"'"];
                }
            })
            .evaluate( function(selector1,selector2){
                if(jQuery(selector2).css("display")=='block' && jQuery(selector1).css("display")=='none')
                {
                    var res="";
                    var i=0;
                    var final =[];
                    jQuery('#dispTable tbody').find('tr').each(function(){
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
                if(data!=false)
                {
                    console.log('data found');
                    var d ={"status":"1","html":data,"code":code.toString()};
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
    if(horseman1["'"+code+"'"]!=undefined)
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
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    code :  unique
                    //image : jQuery(selector7).attr('src')
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",code)
            .then(function(size){
                Jimp.read(code+".png", function (err, img) {
                    if (err) throw err;
                    img.crop(780,820,240,80)
                        .quality(100)
                        .getBuffer(Jimp.MIME_PNG,function(err,buffer){
                            base64Image = buffer.toString('base64');
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
    if(horseman1["'"+code+"'"]!=undefined)
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
                return {
                    height : x,
                    height1 : y,
                    height2 : z,
                    height3 : jQuery(selector4).val(),
                    height4 : jQuery(selector5).val(),
                    height5 : jQuery(selector6).is(':checked'),
                    code :  unique
                    //image : jQuery(selector7).attr('src')
                }
            }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB",code)
            .then(function(size){

                Jimp.read(code+".png", function (err, img) {
                    if (err) throw err;
                    img.crop(780,820,240,80)
                        .quality(100)
                        .getBuffer(Jimp.MIME_PNG,function(err,buffer){
                            base64Image = buffer.toString('base64');
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
    if(horseman1["'"+code+"'"]!=undefined)
    {
        horseman1["'"+code+"'"]
            .click('#dispTable tbody tr:nth-child('+x+') td:nth-child(4) a')
            .evaluate( function(x){
                return  jQuery('#caseHistoryDiv').html();
            },x)
            .then(function(data){
                console.log('done');
            })
            .wait(3000)
            .wait(3000)
            .waitForSelector('#shareSelect')
            .catch(function(err){
                console.log("Unable to access site");
                horseman.close();
                return response.send({"status":"-5","html":"Unable to access site","val1" : x,"val2" :y,"val3" :z,"name":name,"year":year});
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
        if(horseman1["'"+code+"'"]!=undefined)
        {
            console.log(code+'is released');
            horseman1["'" + code + "'"].close();
            delete horseman1["'" + code + "'"];
        }
    }
    response.json("Resources released");
});

router.get('/clean',function (request,response){
    resourcehandler();
    response.json('done!');
});


function resourcehandler (){
    var i;
    var now = parseInt(timestamp('mm'));
    var arr = [];
    async.each(code,function(data,callback) {
        var x, y;
        x = code.indexOf(data);
        y = time[x];
        console.log(data + "  " + y);
        if (now - parseInt(y) >= 1) {
            var j ={code:data};
            arr.push(j);
            time.splice(x,1);
            code.splice(x,1);
        }
        if(x==(time.length-1))
        {
            callback();
        }
    },function(){
        req.post('http://localhost:3000/supreme/release',{json:arr},function (err,data) {
            if(err)
                throw err;
        });

    });

}

module.exports = router;
