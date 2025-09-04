import TicketDAO from"../dao/ticket.dao.js";

class TicketRepository {
    async create(ticketData) {
        return await TicketDAO.create(ticketData);
    }

    async getById(id) {
        return await TicketDAO.getById(id);
    }

    async getAll() {
        return await TicketDAO.getAll();
    }

    async delete(id) {
        return await TicketDAO.delete(id);
    }
}

export default new TicketRepository();
