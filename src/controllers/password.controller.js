import userRepository from "../repositories/user.respository.js";
import User from "../dao/models/user.model.js"
import { sendPasswordResetEmail } from "../services/mailer.service.js";
import crypto from"crypto";
import bcrypt from "bcrypt";

export const forgotPassword = async (req, res )=> {
  const {email} = req.body;

  try {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000;
    await userRepository.update(user._id, user);

    await sendPasswordResetEmail(email, token);

    res.json({ message: " Enviamos un enlace a tu correo para restablecer la contraseña...", token
    });
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
};

export const verifyToken = async (req, res)=>{
  const { token } = req.query;


  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpires : { $gt: Date.now()}});
    if (!user) {
      return res.status(400).json({ error: "Token invalido o expirado"});
    }
    res.json({ message: "Token valido! "});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    if (user.passwordHistory.length > 0) {
      const lastPassword = user.passwordHistory[0].password;
      if (bcrypt.compareSync(newPassword, lastPassword)) {
        return res.status(400).json({
          error: "La nueva contraseña no puede ser igual a la anterior"
        });
      }
    }

    user.passwordHistory.unshift({ password: user.password });
    if (user.passwordHistory.length > 5) {
      user.passwordHistory.pop();
    }

    user.password = bcrypt.hashSync(newPassword, 10);

    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await userRepository.update(user._id, user);

    return res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
