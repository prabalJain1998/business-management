const express = require("express");
const {
  newNotification,
  getAllNotifications,
  deleteNotification,
} = require("../controllers/notificationController.js");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/notification/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newNotification);
router
  .route("/notification/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllNotifications);
router
  .route("/notification/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteNotification);

module.exports = router;
