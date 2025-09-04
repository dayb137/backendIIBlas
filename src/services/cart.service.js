import { v4 as uuidv4} from "uuid";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import Ticket from "../dao/models/ticket.model.js"

class CartService {

    async createCart(userId) {
        if (!userId) throw new Error("userId requerido");
        const cart = await cartRepository.create({ user: userId, products: [] });
        return cart;
    }

    async getCartById(cartId) {
        const cart = await cartRepository.getById(cartId, true); 
        if (!cart) throw new Error("Carrito no encontrado");
        return cart;
    }

    async getCartByUser(userId) {
        const cart = await cartRepository.getByUserId(userId, true);
        return cart || null;
    }

    async addProductToCart(userId, productId, quantity = 1) {
        if (!userId) throw new Error("userId requerido");
        if (!productId) throw new Error("productId requerido");

        let cart = await cartRepository.getByUserId(userId);
        if (!cart) {
            cart = await cartRepository.create({ user: userId, products: [] });
        }

        const product = await productRepository.getById(productId);
        if (!product || product.stock < quantity) throw new Error("Producto no disponible");

        const index = cart.products.findIndex(p => {
            const prodId = p.product._id ? p.product._id.toString() : p.product.toString();
            return prodId === productId;
        });

        if (index >= 0) {
            cart.products[index].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cartRepository.update(cart._id, { products: cart.products });
        return await this.getCartById(cart._id);
    }

    async updateProductQuantity(userId, productId, quantity) {
        if (!userId || !productId) throw new Error("userId y productId requeridos");

        const cart = await cartRepository.getByUserId(userId);
        if (!cart) throw new Error("Carrito no encontrado");
        
        const index = cart.products.findIndex(p => {
            const prodId = p.product._id ? p.product._id.toString() : p.product.toString();
            return prodId === productId;
        });

        if (index < 0) throw new Error("Producto no encontrado en el carrito");

        cart.products[index].quantity = quantity;
        
        await cartRepository.update(cart._id, { products: cart.products });
        return await this.getCartById(cart._id);
    }

    async removeProductFromCart(userId, productId) {
        if (!userId || !productId) throw new Error("userId y productId requeridos");

        const cart = await cartRepository.getByUserId(userId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = cart.products.filter(p => {
            const prodId = p.product._id ? p.product._id.toString() : p.product.toString();
            return prodId !== productId;
            
        });

        await cartRepository.update(cart._id, { products: cart.products });
        return await this.getCartById(cart._id);
    }

    async clearCart(userId) {
        if (!userId) throw new Error("userId requerido");

        const cart = await cartRepository.getByUserId(userId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = [];

        await cartRepository.update(cart._id, { products: [] });
        return await this.getCartById(cart._id);
    }

    async purchaseCart(userId, userEmail) {
        const cart = await cartRepository.getByUserId(userId);
        if(!cart) throw new Error("carrito no encontrado");

        let total = 0;
        const productsNoStock = [];

        for (const item of cart.products){
            const product = await productRepository.getById(item.product);
            
            if (!product) continue;

            if( product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                total += product.price * item.quantity;
            }else {
                productsNoStock.push(item.product.toString());
            }
        }

        if (total === 1) throw new Error(" No se podo completar la compra, producto sin stock");

        const ticket = await Ticket.create({
            code: uuidv4(),
            amount: total,
            purchaser: userEmail,
            
        });

        cart.products = cart.products.filter(p => productsNoStock.includes(p.product.toString()));
        await cartRepository.update(cart._id,{products: cart.products});
    
        return { ticket, productsNoStock};
    
    
    
    };



}

export default new CartService();