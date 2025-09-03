import productService from "../services/product.service.js";
import ProductDTO from "../dto/product.dto.js";

class ProductController {
    async getProducts(req, res){
        try {
            const {page, limit, sort, query } = req.query;
            const result = await productService.getProducts({ page, limit, sort, query});
            res.json({
                ...result,
                products: result.products.map( p => new ProductDTO(p))
            });
        } catch (error) {
            res.status(500).json({ error: error.message});
            
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await productService.getProductById(pid);
            res.json(new ProductDTO(product));
        } catch (error) {
            res.status(404).json({ error: error.message });
            
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await productService.createProduct(req.body);
            res.status(201).json(new ProductDTO(newProduct));
        } catch (error) {
            res.status(400).json({ error: error.message});
            
        }


    }

    async updateProduct(req, res) {
        try {
            const { pid} = req.params;
            const updateProduct = await productService.updateProduct(pid, req.body);
            res.json(new ProductDTO(updateProduct));
        } catch (error) {
            res.status(404).json({ error : error.message});
        }
    }

    async deleteProduct(req, res) {
        try {
            const {pid} = req.params;
            await productService.deleteProduct(pid);
            res.json({ message: "Producto eliminado con exito"});
        } catch (error) {
            res.status(404).json({error: error.message});
            
        }
    }
}

export default new ProductController();