import User from "../dao/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
    
    async login(user) {
        const userData = { ...user._doc }; 
        delete userData.password;

        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { userData, token };
    }

    
    async getAllUsers() {
        const users = await User.find().select("-password").lean();
        return users;
    }

    
    async getUserById(uid) {
        const user = await User.findById(uid).select("-password").lean();
        return user;
    }

    
    async updateUser(uid, updateData) {
        
        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(uid, updateData, { new: true }).lean();
        return updatedUser;
    }

    
    async deleteUser(uid) {
        const deletedUser = await User.findByIdAndDelete(uid).lean();
        return deletedUser;
    }
}

export default new UserService();
