class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.user = cart.user;
        this.products = cart.products.map(item => ({
            productId: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.quantity * item.product.price
        }));
        this.total = this.products.reduce((acc, item) => acc + item.subtotal, 0);
        this.created_at = cart.created_at;

    }
}

export default CartDTO;
