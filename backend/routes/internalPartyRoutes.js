const express = require("express");
const {
  newParty,
  getAllParties,
  getSingleParty,
  getPartyByName,
  updateParty,
} = require("../controllers/internalPartyControllers.js");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/internal/party/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newParty);
router
  .route("/internal/party/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleParty);
router
  .route("/internal/party/search/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllParties);
router
  .route("/internal/party/search/:name")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getPartyByName);
router
  .route("/internal/party/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateParty);

module.exports = router;
