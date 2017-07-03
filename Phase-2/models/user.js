var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var orderHistory = new Schema({
    orderId :
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'order'
        }
});
var dataSchema = new Schema({
        username: String,
        password: String,
        logged:{
            type :Boolean,
            default: false
        },
        searches: Number
    },
    {
        timestamps : true
    }
);
dataSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('user',dataSchema);
module.exports=Pro;
