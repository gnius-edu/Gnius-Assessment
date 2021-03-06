var mongoose = require("mongoose");

var userschema = new mongoose.Schema({
    name : {
        required : true,
        type : String
    },
    password : {
        required : true ,
        type : String
    },
    emailid :{
        required : true,
        type : String,
        unique : true
    },
    contact: {
        required : true,
        type : String,
        unique : true
    },
    organisation : {
        required : false,
        type : String
    },
    avatar : {
        required : false,
        type : String
    },
    bio : {
        required : false,
        type : String
    },
    type : {
        required : true ,
        type : String,
        default : `TRAINER`
    },
    status:{
        required : true,
        default : 1,
        type : Boolean
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    solved: {
        type: Array,
        default: []
    },
    attempted: {
        type: Array,
        default: []
    },
    last_login_date: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: {} }
);

userschema.statics.login = function login(id) {
    return this.findByIdAndUpdate(id, { $set: { 'last_login_date': Date.now() }}, { new: true });
};

var UserModel = mongoose.model('UserModel',userschema);
module.exports = UserModel;