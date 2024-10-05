const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullname:{
        type:String,
        required:true,
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter product name"]
    },
    price:{
        type:Number,
        required:[true, "Please enter price"]
    },
    photo:{
        type:String,
        required:[true, "Please add prodeuct photo"]
    },
    catogory:{
        type:String,
        required:[true,"Please enter catogory"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter stock"]
    },
    description:{
        type:String,
        required:[true,"Please enter description"]
    },
    rating:{
        type:Number,
        default:0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },
      reviews: [reviewSchema] 
},
{
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);