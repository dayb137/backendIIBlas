import productRepository from "../repositories/product.repository.js";

class ProductService {
    async getProducts({ page = 1, limit = 10, sort, query}) {
        const filter = query ? { category:query } : {};
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? {price: sort === "asc" ? 1 : -1 } : {},
            lean: true,
       
        }

        const result = await productRepository.getAll(filter, options);

        return{
            products: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
        };

    }
    
    async getProductById(id) {
        const product = await productRepository.getById(id);
        if (!product) throw new Error("producto no encontrado");
        return product;
    }

    async createProduct(data) {
        if (!data.title || !data.price ) {
            throw new Error("Faltan campos obligatorios");
        }

        return await productRepository.create(data);
    }

    async updateProduct(id, updateData) {
        const product = await productRepository.update(id, updateData);
        if (!product) throw new Error(" error al actualizar el producto");
        return product;
    }

    async deleteProduct(id){
        const product = await productRepository.delete(id);
        if (!product) throw new Error("No se pudo eliminar el producto... ");
        return product;
    }
}

export default new ProductService();