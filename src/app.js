import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import {engine} from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import connectMongodb from "./config/db.js";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import __dirname from "../dirname.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectMongodb();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views")

const PORT = process.env.PORT;
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));



app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter);




io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("addProduct", async (productData) =>{
    try{
      const newProduct = await Product.create(productData);
      const updatedProducts = await Product.find().lean();
      io.emit("productsUpdated", updatedProducts);
    }catch (error){
      console.error("Error al agregar el producto", error);
    }
  });

  socket.on("deleteProduct", async (productId) =>{
    try{
      await Product.findByIdAndDelete(productId);
      const updatedProduct = await Product.find().lean();
      io.emit("productsUpdated", updatedProduct);
    }catch (error){
      console.error("Error al eliminar el producto", error)
    }
  })

});





server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
