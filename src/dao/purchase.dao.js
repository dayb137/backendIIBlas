import Ticket from "../dao/models/ticket.model.js";

class PurchaseDAO{
    async create( ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();

    }

    async getById(id){
        return await Ticket.findById(id).populate("products.product");
    }

    async getByUserId(userId){
        return await Ticket.find({ purchaser: userId}).populate("products.product");
    }
}

export default new PurchaseDAO()