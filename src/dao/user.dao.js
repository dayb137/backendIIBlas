import UserModel from"../dao/models/user.model.js"

class UserDAO{
    constructor(model){
        this.model = model;
    }

    async getByEmail(email){
        return await this.model.findOne({email});
    }

    async createUser(userData) {
        return await this.model.create(userData);
    }

    async getById(id){
        return await this.model.findById(id);
    }

    async getAll() {
        return await this.model.find();
    }

    async update(id, updateData){
        return await this.model.findByIdAndUpdate(id, updateData, { new:true});
    }

    async delete(id){
        return await this.model.findByIdAndDelete(id);
    }
}

export default new UserDAO(UserModel);