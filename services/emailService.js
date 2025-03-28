const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendFeedbackEmail = async (teacherEmail, studentEmail, feedback) => {
  const subject = "📄 Feedback Simulación AvisLatam";

  // Contenido para el estudiante
  const studentHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>📄 Feedback Simulación AvisLatam</h2>
      <p><strong>Profesor:</strong> ${teacherEmail}</p>
      <p><strong>Estudiante:</strong> ${studentEmail}</p>
      <hr />
      <h3>📩 Para el estudiante:</h3>
      <p>Tu ficha clínica ha sido revisada por el profesor <strong>${teacherEmail}</strong>.</p>
      <p><strong>✍️ Feedback recibido:</strong></p>
      <blockquote style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${feedback}</blockquote>
      <hr />
      <p style="color: gray; font-size: 0.9em;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
    </div>
  `;

  // Contenido para el profesor
  const teacherHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>📄 Feedback Simulación AvisLatam</h2>
      <p><strong>Profesor:</strong> ${teacherEmail}</p>
      <p><strong>Estudiante:</strong> ${studentEmail}</p>
      <hr />
      <h3>📩 Para el profesor:</h3>
      <p>Has enviado el siguiente feedback al estudiante <strong>${studentEmail}</strong>.</p>
      <p><strong>✍️ Feedback enviado:</strong></p>
      <blockquote style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${feedback}</blockquote>
      <hr />
      <p style="color: gray; font-size: 0.9em;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
    </div>
  `;

  // Enviar al estudiante
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject,
    html: studentHtml,
  });

  // Enviar al profesor
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: teacherEmail,
    subject,
    html: teacherHtml,
  });
};

module.exports = { sendFeedbackEmail };
