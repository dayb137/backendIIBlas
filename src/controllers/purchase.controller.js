import purchaseService from "../services/purchase.service.js";

class PurchaseController{
    async purchaseCart(req, res) {
        try {
            const userId = req.user.id;
            const userEmail = req.user.email;

            const result = await purchaseService.purchaseCart(userId, userEmail);
            res.json({ status: "success", ...result});
        } catch (error) {
            res.status(400).json({ error: error.message});
        }
    }

    async getPurchaseById(req,res) {
        try {
            const { pid } = req.params;
            const ticket = await purchaseService.getUserPurchaseById(pid);
            res.json({status: "success", payload: ticket});
        } catch (error) {
            res.status(404).json({ error: error.message});
        }
    }

    async getUserPurchases (req, res) {
        try {
            const userId = req.user.id;
            const tickets = await purchaseService.getUserPurchases(userId);
            res.json({status: "success", payload: tickets});

        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}

export default new PurchaseController();