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
    console.log(name);
    console.log("HERe!!");
    horseman
    .viewport(3200,1800)
    .zoom(2)
    .open('http://www.sci.gov.in/case-status')
    .type('input[name="partyname"]', 'Akshat')
    .click('li[data-link="tab3"]')
    .screenshot('2.png')
    .evaluate(function(){
      jQuery('#partyname').val("Akshat");
      jQuery('#ppd').val("D");
      jQuery('#partyyear').val("2015");
      jQuery('#party_case_type').val(1);
      return;
      //     //console.log("das");
    })
    .click('#getPartyData')
    .wait(9000)
    .screenshot('img.png')
    //.waitForSelector("#PNdisplay br")
    //  //.wait(9000)
    .waitFor(function waitForSelector(selector) {
      if(jQuery('#PNdisplay table').html()!='')
      {
        return true;
      }
      else
      if(jQuery('#PNdisplay p').html()!='')
      {
        return true;
      }
      else {
        return false;
      }
    },'#PNdisplay',true)
    .screenshot('img1.png')
    .evaluate( function(selector1,selector2,selector3){
      return {
        height : jQuery(selector1).val(),
        height1 : jQuery(selector2).val(),
        height2 : jQuery(selector3).html()
      }
    }, '#ppd','#partyname','#PNdisplay')
    .then(function(size){
      console.log("done!");
      response.send(size);
      return horseman.close();
    });
  }
  catch(err)
  {
    response.json(err);
  }
});

module.exports = router;
