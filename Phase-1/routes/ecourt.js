var express = require('express');
var router = express.Router();
var Horseman = require('node-horseman');
var Jimp = require("jimp");
var horseman1;
var fs = require('fs');
/* GET users listing. */
router.post('/',function(request,response) {
  try{
    var horseman = new Horseman();
    var x = request.body.val1.toString();
    var y = request.body.val2.toString();
    var z = request.body.val3.toString();
    var name = request.body.name.toString();
    var year = request.body.year.toString();

    console.log(x);
    horseman
    .viewport(3700,2800)
    .zoom(2);
    //horseman.clipRect={top:200,left:900,width:800,height:400};'1~Regional Language~0~~~marathi'
    horseman
    .open('http://services.ecourts.gov.in/ecourtindia_v5/')
    .click('div[id="leftPaneMenuCS"]')
    .evaluate(function(x){
      jQuery('#sess_state_code').val(x);
      fillDistrict();
      return;
    },x)
    .cookies()
    .log()
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
    .wait(8000)
    .screenshot('img3.png')
    // .click('a[id="CSpartyName"]')
    .click('a[title="Refresh Image"]')
    .click('img[src="images/refresh-btn.jpg"]')
    .evaluate( function(selector1){
      return {
        height : jQuery(selector1).attr('src'),
      }
    }, '#captcha_image')
    .then(function(data){
      console.log(data);
    })
    .wait(8000)
    .screenshot('img4.png')
    .evaluate(function(name,year){
      //jQuery('captcha_container_2')..removeClass(  ).addClass( "" );;
      //validateStateDistCourt(this.id);
      jQuery('#petres_name').val(name);
      jQuery('#rgyearP').val(year);
      jQuery('#radB').click();
      return;
    },name,year)
    .wait(8000)
    .evaluate( function(selector1){
      return {
        height : jQuery(selector1).attr('src'),
      }
    }, '#captcha_image')
    .then(function(data){
      console.log(data);
    })
    .screenshot('img.png')
    .evaluate( function(selector1,selector2,selector3,selector4,selector5,selector6){
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
        //image : jQuery(selector7).attr('src')
      }
    }, '#sess_state_code','#court_complex_code','#sess_dist_code',"#petres_name","#rgyearP","#radB")
    .then(function(size){
      Jimp.read("img.png", function (err, img) {
        if (err) throw err;
        img.crop(780,820,240,80)            // resize
        .quality(60)                 // set JPEG quality
        .write("lena-small-bw.jpg"); //
        console.log("written!");
        console.log("reading!");
        fs.readFile('lena11-small-bw.jpg', function (err, data) {
          if (err) throw err;
           horseman1 = horseman;
          var x = {"img":data.toString('base64')};
          console.log(size);
          response.send(size);
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
  if(horseman1!=undefined)
  {
    var captcha = request.body.captcha.toString();
    console.log(horseman1);
    console.log(captcha);
    horseman1
    .evaluate( function(captcha){
      jQuery('#captcha').val(captcha);
      return;
    },captcha)
    //horseman1.close();
    .click('input[class="Gobtn"]')
    .cookies()
    .log()
    .evaluate( function(selector1){
      return {
        height : jQuery(selector1).attr('src'),
        //image : jQuery(selector7).attr('src')
      }
    }, '#captcha_image')
    .then(function(data){
      console.log(data);
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
      console.log(data);
    })
    .screenshot('img.png')
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
    .wait(18000)
    .waitFor(function wait2(selector1,selector2){
      if(jQuery(selector1).children().length>0)
      {
        return true;
      }
      else if(jQuery(selector2).children().length>0)
       {
        return true;
      }
      else return false;
    //  return jQuery(selector1).css("display")==='block'?true:jQuery(selector2).css("display")==='block'?true:false;
    },'#errSpan','#showList',true)
    .screenshot('img1.png')
    .evaluate( function(selector1,selector2){
      return {
        height2 : jQuery(selector1).html(),
        height3 : jQuery(selector2).html()
      }
    },'#errSpan','#showList')
    .then(function(data){
      response.json(data);
    });
  }
  else {
    response.json("Too early");
  }
});



module.exports = router;
