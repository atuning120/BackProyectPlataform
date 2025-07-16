const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
const TEACHER_EMAILS = process.env.TEACHER_EMAILS?.split(',') || [];

//rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    error: 'Demasiados intentos de login. Intenta en 15 minutos.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // No contar requests exitosos
});

router.post('/login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken || typeof idToken !== 'string' || idToken.trim() === '') {
    return res.status(400).json({ error: 'Token de autenticación inválido.' });
  }

  if (idToken.length > 2048) {
    return res.status(400).json({ error: 'Token demasiado largo.' });
  }

  try {
    // Verificar el ID Token de Firebase usando el SDK de Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    // Lógica para asignar roles
    let role = 'alumno'; // Rol por defecto

    // ADMIN
    if (ADMIN_EMAILS.includes(email)) {
      role = 'admin';
    }
    //  PROFESOR
    else if (TEACHER_EMAILS.includes(email) ||
      email.endsWith('@ucn.cl') ||
      email.endsWith('@ce.ucn.cl')
    ) {
      role = 'profesor';
    }

    // Si no es admin o profesor, verificar que sea un alumno UCN válido
    if (role === 'alumno' && !email.endsWith('@alumnos.ucn.cl')) {
      // Lanzamos un error que será capturado por el bloque catch
      throw new Error('Acceso solo para correos institucionales de alumnos UCN.');
    }

    // Crear un token JWT propio de nuestra aplicación
    const userPayload = {
      uid: decodedToken.uid,
      email,
      role,
    };

    const appToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token de nuestra aplicación de vuelta al cliente
    res.json({ token: appToken });

  } catch (error) {
    console.error('Error en autenticación:', error.message);
    res.status(403).send('Acceso solo para correos institucionales de alumnos UCN.');
  }
});

module.exports = router;
