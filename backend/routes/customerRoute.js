const express = require("express");
const {
  newCustomerOrder,
  getSingleCustomer,
  getAllOrders,
  getSingleCustomerByName,
  getSingleCustomerByParty,
  updateCustomer,
  deleteCustomer,
  updateCustomerStatus,
  getAllOrdersByPartyID,
  getPendingOrders,
} = require("../controllers/customerControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/customer/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newCustomerOrder);
router
  .route("/customer/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleCustomer);
router
  .route("/customer/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/customer/search/:name")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleCustomerByName);
router
  .route("/customer/search/party/:partyName")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleCustomerByParty);
router
  .route("/customer/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCustomer)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCustomer);
router
  .route("/customer/update/status/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCustomerStatus);
router
  .route("/customer/party/:partyID")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersByPartyID);

router.route("/singhai/track/:id").get(getSingleCustomer);

module.exports = router;
