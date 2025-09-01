import User from "../dao/models/user.model.js";

class UserRepository {
    async getAll(){
      return await User.find().select("-password").lean();    
    }

    async getById(id){
        return await User.findById(id).lean();
    }

    async create(userData){
        return await User.create(userData);
    }

    async update(id, data){
        return await User.findByIdAndUpdate(id, data, { new: true}).lean();
    }

    async delete(id){
        return await User.findByIdAndDelete(id).lean();
    }
}

export default new UserRepository();