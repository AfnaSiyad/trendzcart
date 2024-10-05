const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRound = 10;

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:[true, "Please enter email"],
        unique:[true, "Please enter a unique email"],
        validate:[validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "Please enter email"],
    },
    role:{
        type:String,
        default:'user'
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

userSchema.pre('save', async function(next){

    if( ! this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, saltRound);

})

module.exports = mongoose.model('User', userSchema);