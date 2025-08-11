import express from "express";
import Product from "../models/product.model.js";



const productsRouter = express.Router()

productsRouter.get("/", async(req, res) =>{
    try{
        const { limit = 10 , page =1, sort, category } = req.query;

        const option = {limit: parseInt, page: parseInt(page), lean: true};

        if(sort ){
            option.sort = {price: sort === "asc" ? 1 : -1};
        }

        const filter = {};
        if (category) filter.category = category;

        const data = await Product.paginate({}, {limit, page});
        const products = data.docs;
        delete data.docs;

        res.status(200).json({ status: "succes", payload: products, ...data})
    }catch(error){
        res.status(500).json({status: "error", message : "Error al recuperar los productos"});
    }
});

productsRouter.get("/:pid", async (req, res) =>{
    try{
        const product = await Product.findById(req.params.pid).lean();
        if (!product){
            return res.status(404).json({status: "error", message: "Producto no encontrado"});
        }
        res.status(200).json({status: "succes", payload: product});
    }catch(error) {
        res.status(500).json({status: "error", message: "Error al buscar un producto"})
    }
})

productsRouter.post("/", async(req, res) =>{
    try{
        const { title, description, price, stock, category} = req.body;
        
        const product = new Product({title, description, price, stock, category});
        await product.save();
        
        res.status(201).json({ status: "succses", payload: product});
    }catch(error){
        res.status(500).send({status: "error", message: "Error al añadir el producto"});
    }
});

productsRouter.delete("/", async(req, res) =>{
    try{
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if(!deleted) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado"});
        }
        res.status(200).json({ status: "succses", payload: "deleted"});
    }catch(error){
        res.status(400).json({ status: "error", message: "Error al elimiar producto"});
    }
});






export default productsRouter;
