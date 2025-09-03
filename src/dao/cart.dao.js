import Cart from "./models/cart.model.js";

class CartDAO {
    async create(cartData) {
        const cart = new Cart(cartData);
        return await cart.save();
    }

    async getById(id) {
        return await Cart.findById(id).populate("products.product");
    }

    async getByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate("products.product");
    }

    async update(id, updateData) {
        return await Cart.findByIdAndUpdate(id, updateData, { new: true }).populate("products.product");
    }

    async delete(id) {
        return await Cart.findByIdAndDelete(id);
    }
}

export default new CartDAO();