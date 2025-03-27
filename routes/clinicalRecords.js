const express = require("express");
const Patient = require("../models/Patient");
const ClinicalRecord = require("../models/ClinicalRecord");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const clinicalRecords = await ClinicalRecord.find();
    res.status(200).json(clinicalRecords);
  } catch (error) {
    console.error("Error al obtener las fichas clínicas:", error);
    res.status(500).json({ message: "Error al obtener las fichas clínicas." });
  }
});

router.post("/", async (req, res) => {
  const { patientRun, content } = req.body;

  // Verifica que patientRun no esté vacío
  if (!patientRun) {
    return res.status(400).json({ message: "El campo 'patientRun' es obligatorio." });
  }

  try {
    // Intenta buscar el paciente en la base de datos
    const patient = await Patient.findOne({ run: patientRun });
    if (!patient) {
      // Si el paciente no se encuentra, devolver un 404
      return res.status(404).json({ message: "Paciente no encontrado con el RUN proporcionado." });
    }

    // Si el paciente existe, crea la ficha clínica
    const clinicalRecord = new ClinicalRecord({
      patientRun,
      content,
    });

    await clinicalRecord.save();
    res.status(201).json(clinicalRecord);
  } catch (err) {
    console.error("Error creando la ficha clínica:", err);
    res.status(500).json({ message: "Error al crear la ficha clínica", error: err.message });
  }
});

module.exports = router;
