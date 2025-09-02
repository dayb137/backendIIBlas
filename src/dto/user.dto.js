export class UsersDTO{
    constructor(usuario){
        this.firstName=usuario.nombre
        this.lastName=usuario.apellido
        this.email=usuario.correo
        this.username=usuario.correo.split("@")[0]
        this.role="user"
    }
}