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
    .evaluate( function(selector1,selector2,selector3){
      if(jQuery(selector2).html())
      {
        var res=[];
        var ct=0;
        var flag=-1;
        var final =[];
        jQuery('#cj tbody').find('tr').each(function(){
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
    }, '#PNdisplay p','#PNdisplay table','#PNdisplay')
    .then(function(data){
      if(data!=false)
      {
        console.log('data found');
        var d ={"status":"1","html":data,"code":unique.toString()}
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

module.exports = router;
