const express = require("express");
const Patient = require("../models/Patient");
const ClinicalRecord = require("../models/ClinicalRecord");
const AnsweredClinicalRecord = require("../models/AnsweredClinicalRecord")
const router = express.Router();

// Obtener todas las fichas clínicas
router.get("/", async (req, res) => {
  try {
    const clinicalRecords = await ClinicalRecord.find();
    res.status(200).json(clinicalRecords);
  } catch (error) {
    console.error("Error al obtener las fichas clínicas:", error);
    res.status(500).json({ message: "Error al obtener las fichas clínicas." });
  }
});

// Crear una nueva ficha clínica
router.post("/", async (req, res) => {
  const { patientRun, content } = req.body;

  try {
    const patient = await Patient.findOne({ run: patientRun });
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado con el RUN proporcionado." });
    }

    // Generar el siguiente número de ficha clínica
    const lastRecord = await ClinicalRecord.findOne().sort({ clinicalRecordNumber: -1 });
    const nextClinicalRecordNumber = lastRecord ? lastRecord.clinicalRecordNumber + 1 : 1;

    const clinicalRecord = new ClinicalRecord({ clinicalRecordNumber: nextClinicalRecordNumber, patientRun, content });
    await clinicalRecord.save();
    res.status(201).json(clinicalRecord);
  } catch (err) {
    console.error("Error creando la ficha clínica:", err);
    res.status(500).json({ message: "Error al crear la ficha clínica", error: err.message });
  }
});

// Eliminar una ficha clínica
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la ficha clínica tiene respuestas asociadas
    const clinicalRecord = await ClinicalRecord.findById(id); // Buscar la ficha clínica por su _id
    if (!clinicalRecord) {
      return res.status(404).json({ message: "Ficha clínica no encontrada." });
    }

    const answeredRecords = await AnsweredClinicalRecord.find({ clinicalRecordNumber: clinicalRecord.clinicalRecordNumber }); // Buscar las respuestas asociadas usando 'clinicalRecordNumber'
    if (answeredRecords.length > 0) {
      return res.status(400).json({ message: "No se puede eliminar la ficha clínica porque tiene respuestas asociadas." });
    }

    const deletedRecord = await ClinicalRecord.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Ficha clínica no encontrada." });
    }
    res.status(200).json({ message: "Ficha clínica eliminada exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando la ficha clínica." });
  }
});

module.exports = router;
