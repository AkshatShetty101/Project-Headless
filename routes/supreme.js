var express = require('express');
var router = express.Router();
var Horseman = require('node-horseman');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended : false}));


/* GET users listing. */

router.post('/',function(request,response) {
var horseman = new Horseman();
  console.log("HERe!!");
  //console.log("Iteration:"+s_year.toString());
  horseman
  .open('http://www.sci.gov.in/case-status')
   .type('input[name="partyname"]', 'Akshat')
  .evaluate(function(){
    jQuery('#partyname').val("Akshat");
    jQuery('#ppd').val("D");
    jQuery('#partyyear').val("2015");
    jQuery('#party_case_type').val(1);
    return;
    //     //console.log("das");
  })
   .click('#getPartyData')
   //.wait(9000)
   .viewport(3200,1800)
   .screenshot('img.png')
   .waitForSelector("#PNdisplay > #cj",{timeout:9000})
   //.wait(9000)
  //   .waitFor(function waitForSelector(selector) {
  //    console.log("IN!!");
  //      return jQuery(selector).length>0;
  // }, '#cj',true)
  .evaluate( function(selector1,selector2,selector3){
    return {
      height : jQuery(selector1).val(),
      height1 : jQuery(selector2).val(),
      height2 : jQuery(selector3).html()
    }
  }, '#ppd','#partyname','#PNdisplay')
  .then(function(size){
    console.log("das"+request.body.s_year);
    response.send(size);
    // return horseman.close();
  });

});

module.exports = router;
