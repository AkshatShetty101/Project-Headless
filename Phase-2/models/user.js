var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var dataSchema = new Schema({
        username: String,
        password: String,
        logged: {
            type: Boolean,
            default: false
        },
        searchesNumber: {
         type: Number,
            default: 0
        },
        searchType: {
            type: Boolean,
            default: false
        },
        searchesDuration: String,
        admin: {
            type: Boolean,
            default: false
        },
        total: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps : true
    }
);
dataSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('user',dataSchema);
module.exports=Pro;