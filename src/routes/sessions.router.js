import { Router } from "express";
import passport from "passport";
import { authenticateUser, authorizeRole } from "../middleware/auth.js";
import userController from "../controllers/user.controller.js";
import passwordController from "../controllers/password.controller.js"
const router = Router();

router.post("/register", userController.register);
router.post("/login", passport.authenticate("login", { session: false }), userController.login);

router.get("/error", (req, res) => res.status(400).json({ error: "Error al autenticar" }));

router.get("/current", passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/error" }), userController.current);
router.get("/logout", userController.logout);

router.post('/forgotPassword', passwordController.forgotPassword);
router.get('/verifyToken', passwordController.verifyToken);
router.post('/resetPassword/:token', passwordController.resetPassword);


router.get("/users", authenticateUser, authorizeRole(["admin"]), userController.getUsers);
router.put("/users/:uid", authenticateUser, authorizeRole(["admin"]), userController.updateUser);
router.delete("/users/:uid", authenticateUser, authorizeRole(["admin"]),userController.deleteUser);

export default router;
