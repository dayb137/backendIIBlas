class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnail = product.thumbnail;
        this.status = product.status;
        this.createdAt = product.created_at;
        this.description = product.description;
    }
}

export default ProductDTO;