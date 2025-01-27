const express = require("express");
const Product = require("../controllers/Product");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.post("/create", authenticateToken, Product.createProduct);
router.get("/sx/:id", Product.getProductById);
router.get("/user/self", authenticateToken, Product.getUserProducts);
router.get("/user/filter", authenticateToken, Product.getProductsByFilter);
router.get("/main/:id", Product.getProductMain);

module.exports = router;
