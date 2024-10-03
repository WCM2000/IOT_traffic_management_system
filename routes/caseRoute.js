const express = require("express");
const router = express();

const caseController = require("../controllers/caseController");

router.use("/search", caseController.searchCases);
router.use("/searchCases", caseController.searchCityCases);

// -------------aggregate functions routes------------------

router.use("/casesCountByDate", caseController.getCasesCountByDate);
router.use("/casesCountByTime", caseController.getCasesCountByTime);
router.use("/casesCountByCity", caseController.getCasesCountByCity);
router.use("/casesCountByActive", caseController.getCasesActiveCount);
router.use(
  "/casesCountByVehicleNumber",
  caseController.getCasesCountByVehicleNumber
);
router.use("/casesCountByYear", caseController.getCaseStatsByYear);
router.use("/casesCountByWeekDays", caseController.getCaseCaseCountByWeekDays);
router.use("/casesCountByDailyHours", caseController.getCaseCountByDailyHours);

// -------------aggregate functions routes-------------------

// router.route("/handleVehicleNumber").get(caseController.handleNumberPlate);
router
  .route("/handleVehicleNumber/:vehicleNumber/:city")
  .get(caseController.handleNumberPlate);
router
  .route("/handleVehicleNumberSearch/:vehicleNumber/:city")
  .get(caseController.handleNumberPlateSearch);

router
  .route("/")
  .get(caseController.getAllCases)
  .post(caseController.createCase);

router
  .route("/:id")
  .get(caseController.getOneCase)
  .patch(caseController.updateOneCase)
  .delete(caseController.deleteOneCase);

module.exports = router;
