const express = require("express");
const {
  newProduct,
  getAllProducts,
  updateProduct,
  getSingleProduct,
} = require("../controllers/productController.js");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
router
  .route("/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);

router
  .route("/product/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleProduct);
router
  .route("/product/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
module.exports = router;
