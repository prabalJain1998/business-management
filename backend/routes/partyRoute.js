const express = require("express");
const {
  newParty,
  getAllParties,
  getSingleParty,
  getPartyByName,
  updateParty,
  deleteParty,
} = require("../controllers/partyController.js");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/party/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newParty);
router
  .route("/party/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleParty);
router
  .route("/party/search/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllParties);
router
  .route("/party/search/:name")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getPartyByName);
router
  .route("/party/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateParty);

module.exports = router;
