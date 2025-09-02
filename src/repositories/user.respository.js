import UserDAO from "../dao/user.dao.js";
class UserRepository {
  async getByEmail(email) {
    return await UserDAO.findOne({ email });
  }

  async createUser(userData) {
    return await UserDAO.create(userData);
  }

  async getById(id) {
    return await UserDAO.findById(id);
  }

  async getAll() {
    return await UserDAO.find();
  }

  async update(id, updateData) {
    return await UserDAO.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await UserDAO.findByIdAndDelete(id);
  }

  async getActiveUsers(){
    const users = await UserDAO.getAll();
    return users.filter(u => u.isActive);
  }

  async getAdmins(){
    const users = await UserDAO.getAll();
    return users.filter(u => u.role === "admin");
  }
}



export default new UserRepository();
