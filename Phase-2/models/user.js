var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var dataSchema = new Schema({
        username: String,
        password: String,
        logged:{
            type :Boolean,
            default: false
        },
        searchesNumber: Number,
        searchType: {
            type :Boolean,
            default: false
        },
        searchesDuration: String,
        admin:{
            type :Boolean,
            default: false
        }
    },
    {
        timestamps : true
    }
);
dataSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('user',dataSchema);
module.exports=Pro;