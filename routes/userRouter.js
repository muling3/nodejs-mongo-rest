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
  addUserRole,
  removeUserRole,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticationMidlleware");
const authorisationMiddleware = require("../middleware/authorizationMiddleware");

router.get("/", [authMiddleware, authorisationMiddleware], getUsers);
router.get("/get", [authMiddleware, authorisationMiddleware], getUser);
router.get("/refresh", authorisationMiddleware, refresh);
router.get("/logout", authorisationMiddleware, logout);

router.post("/", [authMiddleware, authorisationMiddleware], registerUser);
router.post("/login", login);

router.patch("/update", [authMiddleware, authorisationMiddleware], changePass);
router.patch(
  "/add-role",
  [authMiddleware, authorisationMiddleware],
  addUserRole
);
router.patch(
  "/remove-role",
  [authMiddleware, authorisationMiddleware],
  removeUserRole
);
router.delete("/remove", [authMiddleware, authorisationMiddleware], deleteUser);

module.exports = router;
