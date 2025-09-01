import { Router } from "express";
import passport from "passport";
import { authenticateUser } from "../middleware/auth.js";
import userController from "../controllers/user.controller.js";

const router = Router();

router.post("/register", passport.authenticate("register", { session: false }), userController.register);
router.post("/login", passport.authenticate("login", { session: false }), userController.login);

router.get("/error", (req, res) => res.status(400).json({ error: "Error al autenticar" }));

router.get("/current", passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/error" }), userController.current);
router.get("/logout", userController.logout);

router.get("/users", authenticateUser, userController.getUser);
router.put("/users/:uid", authenticateUser, userController.updateUser);
router.delete("/users/:uid", authenticateUser, userController.deleteUser);

export default router;
