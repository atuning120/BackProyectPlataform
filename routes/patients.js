const express = require("express");
const Patient = require("../models/Patient");
const router = express.Router();

// Create a new patient
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);

    // Si el error es por duplicado de RUN (E11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: "El RUN ya está registrado." });
    }

    // Otros errores generales
    res.status(500).json({ message: "Error creando el paciente." });
  }
});

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo los pacientes." });
  }
});

module.exports = router;
