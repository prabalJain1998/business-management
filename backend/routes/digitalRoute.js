const express = require("express");
const {
  newDigitalOrder,
  updateDigitalOrder,
  getAllDigitalOrders,
  deleteDigitalOrder,
  getSingleDigitalOrder,
} = require("../controllers/digitalController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/digital/action/create")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newDigitalOrder);
router
  .route("/digital/action/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateDigitalOrder);
router
  .route("/digital/action/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteDigitalOrder);
router
  .route("/digital/action/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllDigitalOrders);
router
  .route("/digital/details/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleDigitalOrder);

module.exports = router;
