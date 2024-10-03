const express = require("express");
const router = express.Router();
const policeController = require("../controllers/policeController");

// police routes

router.get("/policeNameId", policeController.policeNameId);
router.get("/search", policeController.searchPolice);
router
  .route("/")
  .get(policeController.getAllPoliceStations)
  .post(policeController.createPoliceStation);

router
  .route("/:id")
  .get(policeController.getOnePoliceStation)
  .patch(policeController.updatePoliceStation)
  .delete(policeController.deletePoliceStation);

module.exports = router;
