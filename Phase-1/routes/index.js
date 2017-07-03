var express = require('express');
var Horseman = require('node-horseman');
var router = express.Router();
var Jimp = require("jimp");
var fs = require('fs');
/* GET home page. */
var horseman = new Horseman();
router.get('/', function(request, response, next) {
  horseman
  .viewport(3200,1800)
  .zoom(2)

  .open('https://www.npmjs.com/package/jimp')
  .then(function(data){
    var x = {"img":"shit"};
    response.json(x);
    //horseman.close();
  })
});
router.get('/a', function(request, response, next) {
  horseman
  .viewport(1200,400)
  .zoom(2)
  .open('https://www.google.co.in/')
  .screenshot('big.png')
  .then(function(data){
    console.log("success!!!");
    Jimp.read("big.png", function (err, img) {
      if (err) throw err;
      img.crop(340,120,570,300)            // resize
      .quality(60)                 // set JPEG quality
      .write("lena11-small-bw.jpg");
      console.log("written!");
      console.log("reading!");
        fs.readFile('lena11-small-bw.jpg', function (err, data) {
        if (err) throw err;
        var x = {"img":data.toString('base64'),"idsfds":img};
        console.log(x);
      }); // save
    });
  });




});

module.exports = router;
