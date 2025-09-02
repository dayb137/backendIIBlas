import crypto from "crypto";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.respository.js";
import { transporter } from "../config/mailer.js";

class PasswordService {
  async forgotPassword(email) {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const token = crypto.randomBytes(32).toString("hex");

    await UserRepository.update(user._id, {
      resetToken: token,
      resetTokenExpires: Date.now() + 3600000, 
    });

    const resetUrl = `http://localhost:8080/api/sessions/resetPassword/${token}`;

    await transporter.sendMail({
      from: `"Soporte" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Restablecer contraseña",
      html: `<p>Haz click para restablecer tu contraseña:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return { message: "Email enviado con éxito" };
  }

  async verifyToken(token) {
    const user = await UserRepository.getAll().then(users =>
      users.find(
        u => u.resetToken === token && u.resetTokenExpires > Date.now()
      )
    );
    if (!user) throw new Error("Token inválido o expirado");
    return user;
  }

  async resetPassword(token, newPassword) {
    const user = await this.verifyToken(token);

    if (user.passwordHistory?.length > 0) {
      const lastPassword = user.passwordHistory[0].password;
      if (bcrypt.compareSync(newPassword, lastPassword)) {
        throw new Error("La nueva contraseña no puede ser igual a la anterior");
      }
    }

    user.passwordHistory = user.passwordHistory || [];
    user.passwordHistory.unshift({ password: user.password });
    if (user.passwordHistory.length > 5) user.passwordHistory.pop();

    const hashed = bcrypt.hashSync(newPassword, 10);

    await UserRepository.update(user._id, {
      password: hashed,
      resetToken: undefined,
      resetTokenExpires: undefined,
      passwordHistory: user.passwordHistory,
    });

    return { message: "Contraseña restablecida correctamente" };
  }
}

export default new PasswordService();
