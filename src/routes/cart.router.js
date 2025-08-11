import express from "express";
import Cart from "../models/cart.model.js";

const cartRouter = express.Router();

cartRouter.post("/", async (req, res) =>{
    try{
        const cart = new Cart();
        await cart.save();
        res.status(201).json({ status: "succes", payload: cart});
    } catch(error){
        res.status(500).json({ message: error.message});
    }
});

cartRouter.get("/:cid", async (req, res) =>{
    try{
        const cid  = req.params.cid;
        const cart = await Cart.findById(cid).populate("products.product");

        if(!cart){
            return res.status(404).json({ status: "error", message: "Carrito no encontrado"});
        }
        res.json({ status: "succes", payload: cart });
    }catch(error){
        res.status(500).json({ status: "error", message: error.message });
    }

});

cartRouter.post("/:cid/product/:pid", async(req,res) =>{
    try{
        const {cid, pid} = req.params;
        const {quantity} = req.body;
        const cart = await Cart.findById(cid);

        if(!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado"});
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if(productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        }else{
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.json({ status: "succes", payload: cart });

    }catch(error){
        res.status(500).json({ status: "error", message:error.message});
    }
});


cartRouter.delete("/:cid/products/:pid", async (req, res) =>{
    try{
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        
        if (!cart) return res.status(404).json({ status: "error", message: "No se encontro el carrito"});

        cart.products = cart.products.filter( p => p.product.toString() !== pid);

        await cart.save();
        res.json({ status: "succes", message: "Producto eliminado del carrito ", cart});
    }catch(error){
        res.status(500).json({ status: "error", message: error.message})

    }
});


cartRouter.delete("/:cid", async (req, res) =>{
    try{
        const {cid} = req.params;
        const cart = await Cart.findById(cid);

        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado"});

        cart.products= [];
        await cart.save();

        res.json({ status: "succes", message:  "carrito vacio"});

    }catch(error){
        res.status(500).json ({ status: "error", message: error.message})

    }
})

export default cartRouter;