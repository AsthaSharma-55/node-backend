const mongoose = require('mongoose');
const cartSchema= mongoose.Schema({  
title:String,
price:Number,
description:String,
category:String,
image:String,
rating:Object ,
quantity:Number
});

module.exports= mongoose.model("cartdatas",cartSchema);

