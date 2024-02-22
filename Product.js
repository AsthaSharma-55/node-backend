const mongoose = require('mongoose');
const productSchema= mongoose.Schema({    
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    rating:Object ,
    quantity:Number
});

module.exports= mongoose.model("products",productSchema);