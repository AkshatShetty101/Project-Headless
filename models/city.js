var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var courtSchema = new Schema(
    {
        name :{
            type : String
            // required : true
        },
        code :{
            type : String
            // required : true
        }
    }
);
var districtSchema = new Schema(
    {
        name :{
            type : String
            //required : true
        },
        code :{
            type : String
            // required : true
        },
        court : [courtSchema]
    }
);
var CitySchema = new Schema(
    {
        cname :{
            type : String,
            unique : true
        },
        sname :{
            type : String
        },
        code :{
            type : String
        },
        district : [districtSchema]
    }
);
var map = mongoose.model('city',CitySchema);
module.exports=map;