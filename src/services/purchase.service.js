import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import purchaseRepository from "../repositories/purchase.repository.js";
import PurchaseDTO from "../dto/purchase.dto.js";
import ticketService from "./ticket.service.js";

class PurchaseService {
    async purchaseCart(userId, userEmail) {
    if (!userId || !userEmail) throw new Error("Datos de usuario requeridos");

    const cart = await cartRepository.getByUserId(userId);
    if (!cart) throw new Error("Carrito no encontrado");

    let total = 0;
    const productsNoStock = [];

    for (const item of cart.products){
        const product = await productRepository.getById(item.product);

        if (!product) continue;

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
            total += product.price * item.quantity;
        } else {
            productsNoStock.push(item.product);
        }
    }


    if (total === 0) throw new Error("No se pudo completar la compra: productos sin stock");

    const ticket = await ticketService.createTicket(total, userEmail);

    cart.products = cart.products.filter(p => productsNoStock.includes(p.product.toString()));
    await cartRepository.update(cart._id, { products: cart.products });


    return { ticket, productsNoStock };
}

    async getPurchaseById(purchaseId){
        const ticket = await purchaseRepository.getPurchaseById(purchaseId);
        if(!ticket) throw new Error(" Ticket no encontrado");
        return new PurchaseDTO(ticket);
    }

    async getUserPurchaseById(userId){
        const ticket = await purchaseRepository.getUserPurchaseById(userId);
        return ticket.map(ticket => new PurchaseDTO(ticket));
    }
}
    
export default new PurchaseService();
    