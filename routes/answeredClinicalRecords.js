const express = require("express");
const ClinicalRecord = require("../models/ClinicalRecord");
const AnsweredClinicalRecord = require("../models/AnsweredClinicalRecord");

const router = express.Router();

// Crear una respuesta a una ficha clínica
router.post("/", async (req, res) => {
    const { clinicalRecordNumber, email, answer, teacherEmail, feedback } = req.body;
  
    try {
      // Verificar si la ficha clínica existe
      const clinicalRecord = await ClinicalRecord.findOne({ clinicalRecordNumber });
      if (!clinicalRecord) {
        return res.status(404).json({ message: "Ficha clínica no encontrada." });
      }
  
      // Crear y guardar la respuesta
      const answeredRecord = new AnsweredClinicalRecord({ clinicalRecordNumber, email, answer, teacherEmail, feedback });
      await answeredRecord.save();
      res.status(201).json(answeredRecord);
    } catch (error) {
      console.error("Error guardando la respuesta:", error);
      res.status(500).json({ message: "Error al guardar la respuesta", error: error.message });
    }
});

// Obtener respuestas de un estudiante por su email
router.get("/:email", async (req, res) => {
  const { email } = req.params; // Obtener el email del parámetro de la URL

  try {
    // Buscar las respuestas asociadas al email
    const answeredRecords = await AnsweredClinicalRecord.find({ email });
    res.status(200).json(answeredRecords); // Retornar las respuestas, aunque sea un array vacío
  } catch (error) {
    console.error("Error obteniendo las respuestas:", error);
    res.status(500).json({ message: "Error al obtener las respuestas", error: error.message });
  }
});

module.exports = router;
