const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// auth routes

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use("/search", userController.searchUsers);

router.get("/image/:imageName", userController.getImage);

// protected routes

router.use(authController.protect);

router.patch("/updateMyPassword/:id", authController.updatePassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(
    userController.uploadUserImages,
    userController.resizeUserImages,
    userController.createOneUser
  );

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(
    userController.uploadUserImages,
    userController.resizeUserImages,
    userController.updateOneUser
  )
  .delete(userController.deleteOneUser);

module.exports = router;
