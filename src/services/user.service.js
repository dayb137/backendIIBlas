// src/services/user.service.js
import UserRepository from "../repositories/user.respository.js";
import { UserDTO } from "../dto/user.dto.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  async register(userData) {
    const existingUser = await UserRepository.getByEmail(userData.email);
    if (existingUser) throw new Error("El usuario ya existe");

    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const newUser = await UserRepository.createUser({ ...userData, password: hashedPassword });

    return new UserDTO(newUser); 
  }

  async login({ email, password }) {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) throw new Error("Contraseña incorrecta");

    const payload = { id: user._id, email: user.email, role: user.role.toLowerCase() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { user: new UserDTO(user), token }; 

  }

  async getCurrentUser(userId) {
    const user = await UserRepository.getById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    return new UserDTO(user); 
  }

  async getAllUsers() {
    const users = await UserRepository.getAll();
    return users.map(u => new UserDTO(u)); 
  }

  async getUserById(uid) {
    const user = await UserRepository.getById(uid);
    return user ? new UserDTO(user) : null; 
  }

  async updateUser(uid, updateData) {
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }
    const updatedUser = await UserRepository.update(uid, updateData);
    return updatedUser ? new UserDTO(updatedUser) : null;
  }

  async deleteUser(uid) {
    const deletedUser = await UserRepository.delete(uid);
    return deletedUser ? new UserDTO(deletedUser) : null;
 }
}
export default new UserService();


