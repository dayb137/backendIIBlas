import userService from "../services/user.service.js";

class UserController {
    async register(req, res) {
        res.status(201).json({ message: "Usuario creado", user: req.user });
    }

    async login(req, res) {
        const { userData, token } = await userService.login(req.user);
        res.cookie("cookieToken", token, { httpOnly: true });
        res.status(200).json({ usuarioLogueado: userData, token });
    }

    async current(req, res) {
        res.status(200).json({ message: "Perfil del usuario", usuario: req.user });
    }

    async logout(req, res) {
        res.clearCookie("cookieToken");
        res.status(200).json({
            message: "Logout exitoso",
            payload: "Sesión cerrada correctamente",
        });
    }

    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUser(req, res) {
        try {
            const { uid } = req.params;
            const user = await userService.getUserById(uid);

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            res.status(200).json({ message: "Usuario encontrado", user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { uid } = req.params;
            const data = req.body;
            const updatedUser = await userService.updateUser(uid, data);

            if (!updatedUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { uid } = req.params;
            const deletedUser = await userService.deleteUser(uid);

            if (!deletedUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            res.status(200).json({ message: "Usuario eliminado", user: deletedUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
