import express from "express";
import productController from "../controllers/product.controller.js";
import { authorizeRole} from"../middleware/auth.js";


const productsRouter = express.Router()

productsRouter.get("/",productController.getProducts);
productsRouter.get("/:pid",productController.getProductById);
 
productsRouter.post("/", authorizeRole("admin"),productController.createProduct);
productsRouter.put("/:pid", authorizeRole("admin"),productController.updateProduct);
productsRouter.delete("/:pid", authorizeRole("admin"),productController.deleteProduct);







export default productsRouter;
