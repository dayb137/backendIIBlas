import transporter from "../config/mailer.js";

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`; // Cambia al frontend

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: ' Restablece tu contraseña',
    html: `
      <h2>Restablece tu contraseña</h2>
      <p>Haz clic en el botón para crear una nueva contraseña:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Restablecer contraseña
      </a>
      <p><small>Este enlace expira en 1 hora.</small></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(' Email de recuperación enviado a:', email);
  } catch (error) {
    console.error(' Error al enviar email:', error);
    throw new Error('No se pudo enviar el email');
  }
};