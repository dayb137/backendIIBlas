import { v4 as uuidv4 } from "uuid";
import ticketRepository from "../repositories/ticket.repository.js";
import TicketDTO from "../dto/ticket.dto.js";

class TicketService {
    async createTicket(amount, purchaser) {
        if (!amount || !purchaser) throw new Error("Datos incompletos para generar ticket");

        const ticketData = {
            code: uuidv4(),
            amount,
            purchaser
        };

        const ticket = await ticketRepository.create(ticketData);
        return new TicketDTO(ticket);
    }

    async getTicketById(id) {
        const ticket = await ticketRepository.getById(id);
        if (!ticket) throw new Error("Ticket no encontrado");
        return new TicketDTO(ticket);
    }

    async getAllTickets() {
        const tickets = await ticketRepository.getAll();
        return tickets.map(ticket => new TicketDTO(ticket));
    }
}

export default new TicketService();