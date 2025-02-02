var express = require('express');
var router = express.Router();
var Horseman = require('node-horseman');
var Jimp = require("jimp");
var horseman1 =[];
var fs = require('fs');
var rn = require('random-number');
var gen = rn.generator({
  min:  0
  , max:  9999
  , integer: true
});

router.post('/',function(request,response) {
  try{
    var unique = gen().toString();
    console.log(unique);
    var horseman = new Horseman({timeout:20000});
    var name = request.body.name.toString();
    var year = request.body.year.toString();
    var st = request.body.status.toString();
    console.log(name);
    console.log("HERe!!");
    horseman
    .viewport(3200,1800)
    .zoom(2)
    .open('http://www.sci.gov.in/case-status')
    .catch(function(err){
      console.log("Unable to access site");
      horseman.close();
      return response.send({"status":"-5","html":"Unable to access site"});
    })
    .click('li[data-link="tab3"]')
    .evaluate(function(name,year,st){
      jQuery('#partyname').val(name);
      jQuery('#ppd').val(st);
      jQuery('#partyyear').val(year);
      jQuery('#party_case_type').val(1);
      return;
    },name,year,st)
    .click('#getPartyData')
    .waitFor(function waitForSelector(selector) {
      if(jQuery('#PNdisplay table').html())
      {
        return true;
      }
      else
      if(jQuery('#PNdisplay p').html())
      {
        return true;
      }
      else {
        return false;
      }
    },'#PNdisplay',true)
    .catch(function(err) {
      console.log("Timeout Occured");
    })
    .evaluate( function(selector1,selector2,selector3){
      return {
        height : jQuery(selector1).html(),
        height1 : jQuery(selector2).html(),
        height2 : jQuery(selector3).html()
      }
    }, '#PNdisplay p','#PNdisplay table','#PNdisplay')
    .then(function(size){
      console.log("done!");
      console.log(size);
      var data;
      if(size.height1)
      {
        // data={"status":"1","html":size.height2,"code":unique};
        horseman1["'"+unique+"'"]=horseman;
      }
      else
      if(size.height)
      {
        data={"status":"2","html":size.height2};
        response.send(data);
      }
      else {
        data={"status":"-1","html":"Do it again!"};
        response.send(data);
      }
    })
    .evaluate( function(selector1,selector2){
      if(jQuery(selector2).html())
      {
        var res=[];
          var ct=0;
          var flag=-1;
          var final =[];
        jQuery('#cj').find('tbody').find('tr').each(function(){
          if(ct==0)
          final.push(jQuery(this).html());
          else {
            flag=-1;
            if((ct)%4==0)
            {
              flag=1;
              ct=1;
            }
            res.push(jQuery(this).html());
            if(flag==1)
            {
              final.push(res);
              res=[];
            }
          }
          ct++;
        });
        return final;
      }
      else return false;
    }, '#PNdisplay p','#PNdisplay table')
    .then(function(data){
      if(data!=false)
      {
        console.log('data found');
        var d ={"status":"1","html":data,"code":unique.toString()};
        response.json(d);
      }
      else {
        horseman.close();
      }
    });
  }
  catch(err)
  {
    response.json(err);
  }
});

router.post('/view',function(request,response){
    var code = request.body.code.toString();
    if (horseman1["'" + code + "'"] !== undefined) {
        console.log("In!!");
        var x= ((parseInt(request.body.x)-1)*4+2).toString();
        console.log(x);
        horseman1["'" + code + "'"]
            .waitFor(function(){

            })
            .then(function(data){

                response.json(data);
            })
    }
});

router.post('/release',function(request,response){
  var code = request.body.code.toString();
  if(horseman1["'"+code+"'"]!==undefined)
  {
    horseman1["'"+code+"'"].close();
    delete horseman1["'"+code+"'"];
    response.json("Resource released");
  }
  else {
    response.json("Too early");
  }
});


module.exports = router;
