class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.created_at = ticket.created_at;
    }
}

export default TicketDTO;