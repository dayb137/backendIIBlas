import cartService from "../services/cart.service.js";

class CartController {
    async getCart(req,res) {
        try {
            const cart = await cartService.getCartByUser(req.user.id);
            res.json( cart || {product: [] });
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
    }

    async createCart(req, res) {
        try {
            const cart = await cartService.createCart();
            res.status(201).json({status: "success", payload: cart})
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message});

        }
    }

    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            res.json({status: "success", payload: cart});

        } catch (error) {
            res.status(500).json({status: "error", message: error.message});
        }
    }

    async addProduct(req, res) {
        try {
            const {pid} = req.params;
            const { quantity } = req.body;
            const updateCart = await cartService.addProductToCart(req.user.id, pid, quantity);
            res.json(updateCart);
        } catch (error) {
            res.status(400).json({ error: error.message});
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const { quantity} = req.body;
            const updateCart = await cartService.updateProductQuantity(req.user.id, pid, quantity);
            res.json(updateCart)

        } catch (error) {
            res.status(400).json({ error: error.message});
        }

    }
    async deleteProduct(req, res) {
        try {
            
            const { pid } = req.params;
            const updatedCart = await cartService.removeProductFromCart(req.user.id, pid);
            res.json({ status: "success", payload: updatedCart });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async clearCart(req, res) {
        try {
            const clearedCart = await cartService.clearCart(req.user.id);
            res.json({ status: "success", payload: clearedCart });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
}

export default new CartController();