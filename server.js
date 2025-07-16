require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");

const app = express();

// ===== MIDDLEWARE DE SEGURIDAD GLOBAL =====

// Helmet para seguridad general
app.use(helmet({
  contentSecurityPolicy: false, // Ajusta según necesites
  crossOriginEmbedderPolicy: false
}));

// CORS configurado (mejor que cors() sin opciones)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutos
  max: 5, // 100 requests por IP
  message: {
    error: 'Demasiadas peticiones desde esta IP. Intenta más tarde. (ACTUALIZAO)'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Logging
app.use(morgan('combined'));

// Body parsing con límites
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable X-Powered-By
app.disable('x-powered-by');

// ===== RUTAS =====
app.use('/api/auth', authRoutes);

// Connect to MongoDB (versión actualizada sin opciones deprecated)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

// Routes
app.use("/api/patients", require("./routes/patients"));
app.use("/api/clinical-records", require("./routes/clinicalRecords"));
app.use("/api/answered-clinical-records", require("./routes/answeredClinicalRecords"));

// ===== MANEJO DE ERRORES GLOBAL =====
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message 
  });
});

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
