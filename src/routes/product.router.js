import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateUser, authorizeRole} from"../middleware/auth.js";


const productsRouter = express.Router()

productsRouter.get("/",authenticateUser, productController.getProducts);
productsRouter.get("/:pid",authenticateUser, productController.getProductById);
 
productsRouter.post("/",authenticateUser, authorizeRole("admin"),productController.createProduct);
productsRouter.put("/:pid",authenticateUser, authorizeRole("admin"),productController.updateProduct);
productsRouter.delete("/:pid",authenticateUser, authorizeRole("admin"),productController.deleteProduct);







export default productsRouter;
