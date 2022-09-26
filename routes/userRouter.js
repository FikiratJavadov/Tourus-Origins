const router = require("express").Router();
const authContoller = require("../controller/authContoller");
const userController = require("../controller/userController");
const protectAuth = require("../middleware/protectAuth");
const { getMe } = require("../utils/factory");

//{id: userId}
router.post("/signup", authContoller.signup);
router.post("/login", authContoller.login);
router.post("/forgetPassword", authContoller.forgetPassword);
router.patch("/resetPassword/:token", authContoller.resetPassword);

router.use(protectAuth);
router.get("/me", getMe, userController.getOneUser);
router.patch("/changePassword", userController.changePassword);
router.patch("/", userController.changeUserData);

module.exports = router;
