const router = require("express").Router();
const authContoller = require("../controller/authContoller");
const userController = require("../controller/userController");
const protectAuth = require("../middleware/protectAuth");

router.post("/signup", authContoller.signup);
router.post("/login", authContoller.login);

router.post("/forgetPassword", authContoller.forgetPassword);
router.patch("/resetPassword/:token", authContoller.resetPassword);

router.patch("/changePassword", protectAuth, userController.changePassword);
router.patch("/", protectAuth, userController.changeUserData);

module.exports = router;
