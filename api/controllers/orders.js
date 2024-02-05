const mongoose = require("mongoose")
const Order = require("../models/order");
const Product = require("../models/product");

module.exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select("produtc quantity _id")
    .populate('product', 'name')
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            orders: result.map(order => {
                return {
                    _id: order._id,
                    productId: order.product,
                    quantity: order.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + order._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

module.exports.orders_create_order = (req, res, next) => {

    Product.findById(req.body.productId)
    .then(product => {
        if (!product){
            return res.status(404).json({
                error: "error 404 Not Found"
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        })
        return order.save()
    })
    .then(result => {
        res.status(201).json({
            message: "Success POST Request on orders",
            createdOrder: {
                _id: result._id, 
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch (err => {
        res.status(500).json({
            error: err
        });
    });
}

module.exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        res.status(200).json({
            order: order,
            request: {
                type: "GET", 
                url: "http://localhost:3000/orders"
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

module.exports.orders_delete_order = (req, res, next) => {
    Order.findByIdAndDelete({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            "message" : "Order Deleted",
            request: {
                type: "POST", 
                url: "http://localhost:300/orders",
                body: {productId: "Id", quantity: "Number"},
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
} 