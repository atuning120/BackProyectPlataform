const admin = require("firebase-admin");


const serviceAccount = require("../serviceAccountKey.json"); // <-- CAMBIA ESTO por la ruta a tu archivo de credenciales

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
