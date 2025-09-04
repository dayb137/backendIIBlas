import express from "express";
import cartController from "../controllers/cart.controller.js";
import { authenticateUser, authorizeRole } from "../middleware/auth.js";


const cartRouter = express.Router();

cartRouter.post("/", authenticateUser, authorizeRole("user", "admin"), cartController.createCart);
cartRouter.get("/", authenticateUser, authorizeRole("user", "admin"), cartController.getCart); 
cartRouter.get("/:cid", authenticateUser, authorizeRole("user", "admin"), cartController.getCartById);

cartRouter.post("/product/:pid", authenticateUser, authorizeRole("user", "admin"), cartController.addProduct);
cartRouter.put("/product/:pid", authenticateUser, authorizeRole("user", "admin"), cartController.updateProduct);
cartRouter.delete("/:cid/products/:pid", authenticateUser, authorizeRole("user", "admin"), cartController.deleteProduct);
cartRouter.delete("/:cid", authenticateUser, authorizeRole("user", "admin"), cartController.clearCart);



export default cartRouter;