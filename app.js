const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect("mongodb+srv://mozagazzer:" + process.env.MONGO_ATLAS_PASSWORD + "@chat-me.l2jdqjq.mongodb.net/?retryWrites=true&w=majority")

app.use(morgan('dev'));
// the incoming formats you allow to be parsed
app.use('uploads/', express.static("uploads"))
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Accept, Content-Type, Authorization" );

    if (req.method === "OPTIONS") {
        req.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    }); 
});


module.exports = app; 