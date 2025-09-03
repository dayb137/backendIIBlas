import Product from "./models/product.model.js";

class ProductDAO {
    async getAll(filter = {}, options ={}){
        return await Product.paginate(filter, options);
    }

    async getById(id){
        return await Product.findById(id);
    }

    async create(data){
        return await Product.create(data);
    }

    async update(id, updateData){
        return await Product.findByIdAndUpdate(id, updateData, {new: true});
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}


export default new ProductDAO();