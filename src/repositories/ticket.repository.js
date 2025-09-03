import ticketModel from "../dao/models/ticket.model";

class TicketRepository{
    async createTicket(data){
        return await ticketModel.create(data);
    } 

}

export default new TicketRepository();