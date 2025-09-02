export class UserDTO{
    constructor(user){
        this.id = user._id;
        this.firstName=user.name
        this.lastName=user.lastName
        this.email=user.email
        this.username=user.email.split("@")[0]
        this.role="user"
    }
}