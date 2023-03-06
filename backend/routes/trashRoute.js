const express = require("express");
const {
  newTrashOrder,
  getAllTrashOrders,
  deleteTrashOrder,
} = require("../controllers/trashController.js");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/trash/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newTrashOrder);
router
  .route("/trash/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllTrashOrders);
router
  .route("/trash/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteTrashOrder);

module.exports = router;
