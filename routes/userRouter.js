const router = require("express").Router();
const authContoller = require("../controller/authContoller");
const userController = require("../controller/userController");
const protectAuth = require("../middleware/protectAuth");
const { getMe } = require("../utils/factory");
const upload = require("../utils/multer");

//{id: userId}
router.post("/signup", upload.array("photo"), authContoller.signup);
router.post("/login", authContoller.login);
router.post("/forgetPassword", authContoller.forgetPassword);
router.patch("/resetPassword/:token", authContoller.resetPassword);

router.use(protectAuth);
router.patch("/changePassword", userController.changePassword);
router.patch("/", userController.changeUserData);
router.delete("/me", userController.deleteMe);

module.exports = router;
