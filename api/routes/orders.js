const express           = require ("express");
const router            = express.Router();
const checkAuth         = require("../middleware/check-auth")
const OrderControllers  = require("../controllers/orders");

router.get("/", checkAuth, OrderControllers.orders_get_all);

router.post("/", checkAuth, OrderControllers.orders_create_order);

router.get("/:orderId", checkAuth, OrderControllers.orders_get_order);

router.delete("/:orderId", checkAuth, OrderControllers.orders_delete_order);

module.exports = router;

