import PurchaseDAO from "../dao/purchase.dao.js";

class PurchaseRepository {
  async createPurchase(data) {
    return PurchaseDAO.create(data);
  }

  async getPurchaseById(id) {
    return PurchaseDAO.getById(id);
  }

  async getUserPurchaseById(userId) {
    return PurchaseDAO.getByUserId(userId);
  }
}

export default new PurchaseRepository();