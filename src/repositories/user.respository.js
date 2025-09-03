import UserDAO from "../dao/user.dao.js";
class UserRepository {
  async getByEmail(email) {
    return await UserDAO.getByEmail(email);
  }

  async getByToken(token){
    return await UserDAO.getByToken(token);
  }

  async createUser(userData) {
    return await UserDAO.createUser(userData);
  }

  async getById(id) {
    return await UserDAO.getById(id);
  }

  async getAll() {
    return await UserDAO.getAll();
  }

  async update(id, updateData) {
    return await UserDAO.update(id, updateData);
  }

  async delete(id) {
    return await UserDAO.delete(id);
  }
  async save(user) {
    return await UserDAO.update(user._id, user);
  }

  async getActiveUsers(){
    const users = await this.getAll();
    return users.filter(u => u.isActive);
  }

  async getAdmins(){
    const users = await this.getAll();
    return users.filter(u => u.role === "admin");
  }
}



export default new UserRepository();
