const express = require("express");
const Patient = require("../models/Patient");
const ClinicalRecord = require("../models/ClinicalRecord");
const router = express.Router();

// Obtener todos los pacientes
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo los pacientes." });
  }
});

// Obtener un paciente por su RUN
router.get("/:patientRun", async (req, res) => {
  try {
    const patient = await Patient.findOne({ run: req.params.patientRun });
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo los datos del paciente." });
  }
});

// Crear un nuevo paciente
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    // Error duplicado de RUN (E11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: "El RUN ya está registrado." });
    }
    // Otros errores
    res.status(500).json({ message: "Error creando el paciente." });
  }
});

// Eliminar un paciente por su ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el paciente tiene fichas clínicas asociadas (usando 'run' en lugar de '_id')
    const patient = await Patient.findById(id); // Buscar el paciente por su _id
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    const clinicalRecords = await ClinicalRecord.find({ patientRun: patient.run }); // Usar 'run' del paciente
    if (clinicalRecords.length > 0) {
      return res.status(400).json({ message: "No se puede eliminar el paciente porque tiene fichas clínicas asociadas." });
    }

    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }
    res.status(200).json({ message: "Paciente eliminado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando el paciente." });
  }
});


module.exports = router;
