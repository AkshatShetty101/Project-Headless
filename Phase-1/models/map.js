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
var StateSchema = new Schema(
    {
        name :{
            type : String
            // required : true
        },
        code :{
            type : String
            // required : true
        },
        district : [districtSchema]
    }
);
var map = mongoose.model('map',StateSchema);
module.exports=map;