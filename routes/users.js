var express = require('express');
var router = express.Router();
var Horseman = require('node-horseman');

/* GET users listing. */
var horseman = new Horseman();
router.get('/',function(request,response) {
    horseman
        .open('http://www.sci.gov.in/judgments')
        .evaluate(function(){
            jQuery('#JBJfrom_date').val("06-06-2017");
            jQuery('#JBJto_date').val("08-06-2017");
            return;
        })
        .click('#getJBJ')
        .waitForSelector("#JBJ > table")
        .evaluate( function(selector){
            return {
                height : jQuery(selector).html()
            }
        }, '#JBJ')
        .then(function(size){
            response.send(size);
           // return horseman.close();
        });

});

module.exports = router;
