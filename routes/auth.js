const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(401).send('Se requiere token de autenticación.');
  }

  try {
    // Verificar el ID Token de Firebase usando el SDK de Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    // Lógica para asignar roles
    let role = 'alumno'; // Rol por defecto

    // ADMIN
    if (email === 'vergamacarena@gmail.com') {
      role = 'admin';
    }
    //  PROFESOR
    else if (
      [
        'benjagilberto44@gmail.com',
        'silasglauco@gmail.com',
        'cristian.ignacio.nunez@gmail.com'
      ].includes(email) ||
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
    res.status(403).send('Acceso solo para correos institucionales de alumnos UCN.');
  }
});

module.exports = router;
