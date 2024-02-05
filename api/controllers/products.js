const Product = require("../models/product");
const mongoose = require("mongoose");

module.exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndDelete({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${doc.id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.body.productImage,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Successfully One Product Created",
        createdProduct: {
          product: {
            name: result.name,
            price: result.price,
            id: result._id,

            request: {
              type: "POST",
              description: "Successful POST request",
              url: "http://localhost:3000/products/" + result._id,
            },
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      if (doc) {
        const response = {
          product: {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          error: {
            message: "Not Found",
          },
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const prop of req.body) {
    updateOps[prop.propName] = prop.value;
  }
  Product.findByIdAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
    .exec()
    .then((result) => {
      const response = {
        product: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
