import CartDAO from "../dao/cart.dao.js";


class CartRepository{
    async getById(cartId){
        return CartDAO.getById(cartId);

    }

    async getByUserId(userId) {
        return CartDAO.getByUserId(userId);
    }

    async create(cartData) {
        return CartDAO.create(cartData)
    }

    async update(cartId, updateData) {
        return await CartDAO.update(cartId, updateData, { new: true });
    }

    async delete(id) {
        return CartDAO.delete(id);
    }
}

export default new CartRepository();