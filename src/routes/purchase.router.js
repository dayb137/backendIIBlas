import express from "express";
import purchaseController from "../controllers/purchase.controller.js";
import { authenticateUser, authorizeRole } from "../middleware/auth.js";

const purchaseRouter = express.Router();

purchaseRouter.post("/", authenticateUser, authorizeRole("user"), purchaseController.purchaseCart);
purchaseRouter.get("/:pid", authenticateUser, authorizeRole("user", "admin"), purchaseController.getPurchaseById);

export default purchaseRouter;