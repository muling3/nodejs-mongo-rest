const router = require("express").Router();
const {
  getUsers,
  deleteUser,
  registerUser,
  getUser,
  changePass,
  refresh,
  logout,
  login,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authorisationMidlleware");

router.get("/", authMiddleware, getUsers);
router.get("/get", getUser);
router.get("/refresh", refresh);
router.get("/logout", logout);

router.post("/", registerUser);
router.post("/login", login);

router.patch("/update", authMiddleware, changePass);
router.delete("/remove", authMiddleware, deleteUser);

module.exports = router;
