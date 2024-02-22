const express = require('express');
require("./config");
const Product = require('./Product');
const users = require('./users');
const cart = require('./cart');
const dbConnect = require('./mongodb')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express();
const jwtKey = 'e-commerse'


app.use(express.json())
app.use(cors())

// const main = async () => {
//     // await mongoose.connect('mongodb://localhost:27017/e-com')
//     const Productmodal = new mongoose.model('Product', productSchema)
//     let data = new Productmodal({ name: "m8" ,product:"mi",price:500,brand:"mi"})
//     let result = await data.save()
//     console.log("resultttttttttt", result)
// }
// main()


// const updateInDB =async  () => {
//     const Product = mongoose.model('products', productSchema);
//     let data =await  Product.updateOne(
//         { name: "m8" },
//         {
//             $set: { price: 550,name:'mi pro 6' }
//         }
//     )
//     console.log(data)
// }
// updateInDB()

// const deleteInDB = async ()=>{
//     const Product = mongoose.model('products', productSchema);
//     let data = await Product.deleteOne({name:'nokia'})
//     console.log(data);
// }
// // deleteInDB()

//     const findInDB = async ()=>{
//     const Product = mongoose.model('products', productSchema);
//     let data = await Product.find({name:'nokia'})
//     console.log(data);
// }

// // findInDB();

//////////////////////////search api//////////////////////////////

// app.get('/search/:key', async (req, res) => {
//     console.log(req.params.key)
//     const data = await Product.find({
//         "$or": [
//             {
//                 "name": { $regex: req.params.key },              //seach ny name
//                 // "brand": { $regex: req.params.key }           // search by letters only
//             }
//         ]
//     })
//     res.send(data)
// })


function verifyToken(req, res, next) {
    let token = req.headers['authorization']
    // console.log("middleware called", token)    
    if (token) {
        token = token.split(' ')[1]
        // console.log(token)
        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(401).send({ result: "please provide a valid token" })
            } else {
                next(); // Call next only when the token is valid
            }
        });
    } else {
        res.status(403).send({ result: "please add header with token" })
    } 
}
 
app.get('/', async (req, res) => {
    let data = await dbConnect()
    data = await data.find().toArray()
    res.send(data)
    // console.log(data)
})

app.post('/login', async (req, res) => {
    // let data = await dbConnect()
    if (req.body.password && req.body.email) {
        let user = await users.findOne(req.body).select('-passowrd')
        if (user) {
            jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send("somthing went wrong")
                }
                res.send({ user, auth: token })
            })

        } else {
            res.send({ result: "No user found" })
        }
    } else {
        res.send({ result: "No user found" })
    }
})

app.post('/register', async (req, res) => {
    let user = new users(req.body)
    let result = await user.save()
    jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send("somthing went wrong")
        }
        res.send({ result, auth: token })
    })
})

app.get('/products', async (req, res) => {
    let data = await Product.find()
    if (data.length > 0) {
        res.send(data)
    } else {
        res.send("Result : Product not find")
    }
})

app.put('/products/:id', async (req, res) => {
    let data = await Product.updateOne(
        {
            _id: req.params.id
        },
        {
            $set: req.body
        }
    )
    res.send(data)
})

app.get('/products/:id', async (req, res) => {
    try {
        let data = await Product.findOne({ _id: req.params.id });
        if (data) {
            // console.log(data);
            res.send(data);
        } else {
            res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/add-product', async (req, res) => {
    let product = new Product(req.body)
    let result = await product.save()
    res.send(result)
})

//////////////////////////cart/////////////
app.post('/cartdata', async (req, res) => {
    let cartdata = new cart(req.body)
    let result = await cartdata.save()
    res.send(result)
})
app.get('/cartdata', async (req, res) => {
    let data = await cart.find()
    if (data.length > 0) {
        res.send(data)
    } else {
        res.send([])
    }

})
app.put('/cartdata/:id', async (req, res) => {
    let data = await cart.updateOne(
        {
            _id: req.params.id
        },
        {
            $set: req.body
        }
    )
    res.send(data)

})

app.delete('/cartdata/:id', async (req, res) => {
    let data = await cart.deleteOne({ _id: req.params.id })
    res.send(data)
});

app.get('/search-product/:key', verifyToken, async (req, res) => {
    console.log(req.params.key)
    const data = await Product.find({
        $or: [
            { "name": { $regex: req.params.key } },
            { "category": { $regex: req.params.key } }
        ]
    });
    res.send(data)
})

app.listen(5000)
