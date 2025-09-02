import PasswordService from "../services/password.service.js";

class PasswordController {
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await PasswordService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyToken(req, res) {
    try {
      const { token } = req.query;
      await PasswordService.verifyToken(token);
      res.json({ message: "Token válido" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      const result = await PasswordService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new PasswordController();

