import Ticket from "./models/ticket.model.js";

class TicketDAO {
    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    async getById(id){
        return await Ticket.findById(id);

    }

    async getAll(){
        return await Ticket.find();
    }

    async delete(id){
        return await Ticket.findByIdAndDelete(id);
    }
}

export default new TicketDAO();