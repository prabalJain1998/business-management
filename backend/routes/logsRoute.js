const express = require("express");
const { newLog, getAllLogs } = require("../controllers/logsController.js");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/logs/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newLog);
router
  .route("/logs/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllLogs);

module.exports = router;
