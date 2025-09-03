import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
    async getAll(filter, options) {
        return await ProductDAO.getAll(filter, options);
    }

    async getById(id) {
        return await ProductDAO.getById(id);
    
    }

    async create(data) {
        return await ProductDAO.create(data);
    }

    async update(id, updateData) {
        return await ProductDAO.update(id, updateData);
    }

    async delete(id) {
        return await ProductDAO.delete(id);
    }

}

export default new ProductRepository();