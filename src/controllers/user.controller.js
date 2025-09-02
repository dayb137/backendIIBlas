import userService from "../services/user.service.js";

class UserController {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.login({ email, password });

      res.cookie("cookieToken", token, { httpOnly: true });
      res.status(200).json({ status: "success", payload: user, token });

    } catch (error) {
      res.status(401).json({ status: "error", message: error.message });
    }
  }

  async current(req, res) {
    try {
      const userId = req.user.id; 
      const user = await userService.getCurrentUser(userId);

      res.status(200).json({ status: "success", payload: user });

    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("cookieToken");
    res.status(200).json({ status: "success", message: "Sesión cerrada correctamente" });
  }

  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({ status: "success", payload: users });


    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.uid);
      if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

      res.status(200).json({ status: "success", payload: user });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.uid, req.body);
      if (!updatedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

      res.status(200).json({ status: "success", payload: updatedUser });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await userService.deleteUser(req.params.uid);
      if (!deletedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
      
      res.status(200).json({ status: "success", payload: deletedUser });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export default new UserController();
