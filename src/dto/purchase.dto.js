class PurchaseDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.code = ticket.code;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser; // email o id según lo que quieras exponer
    this.products = ticket.products.map(item => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.quantity * item.product.price
    }));
    this.totalProducts = this.products.length;
    this.created_at = ticket.created_at;
  }
}

export default PurchaseDTO;