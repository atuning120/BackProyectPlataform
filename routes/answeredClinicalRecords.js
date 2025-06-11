const express = require("express");
const ClinicalRecord = require("../models/ClinicalRecord");
const AnsweredClinicalRecord = require("../models/AnsweredClinicalRecord");
const { sendFeedbackEmail } = require("../services/emailService");

const router = express.Router();


// Obtener todas las respuestas
router.get("/", async (req, res) => {
  try {
    const answeredRecords = await AnsweredClinicalRecord.find();
    res.status(200).json(answeredRecords);
  } catch (error) {
    console.error("Error obteniendo las respuestas:", error);
    res.status(500).json({ message: "Error al obtener las respuestas", error: error.message });
  }
});

// Obtener respuestas por email de estudiante
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const answeredRecords = await AnsweredClinicalRecord.find({ email });
    res.status(200).json(answeredRecords);
  } catch (error) {
    console.error("Error obteniendo las respuestas:", error);
    res.status(500).json({ message: "Error al obtener las respuestas", error: error.message });
  }
});

// Actualizar retroalimentación
router.put("/:id", async (req, res) => {
  const { feedback, teacherEmail, clinicalRecordName} = req.body;
  const { id } = req.params;

  try {
    const answeredRecord = await AnsweredClinicalRecord.findById(id);
    if (!answeredRecord) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }

    answeredRecord.feedback = feedback;
    answeredRecord.teacherEmail = teacherEmail;
    answeredRecord.clinicalRecordName = clinicalRecordName;
    await answeredRecord.save();
    await sendFeedbackEmail(teacherEmail, answeredRecord.email, feedback);

    res.status(200).json(answeredRecord);
  } catch (err) {
    console.error("Error al actualizar la retroalimentación:", err);
    res.status(500).json({ message: "Error al actualizar la retroalimentación", error: err.message });
  }
});


// Guardar una nueva respuesta
router.post("/", async (req, res) => {
  try {
    const { clinicalRecordNumber, clinicalRecordName, email, answer, formatIds, responseTime } = req.body;
    
    // Validación de campos obligatorios
    if (
      !clinicalRecordNumber ||
      !clinicalRecordName || 
      !email ||
      !answer ||
      !formatIds || !Array.isArray(formatIds) || formatIds.length === 0 ||
      !responseTime
    ) {
      return res.status(400).json({ message: "Faltan datos obligatorios o son incorrectos (clinicalRecordNumber, email, answer, formatIds, responseTime)" });
    }

    // Validación de la estructura de 'answer'
    if (typeof answer !== 'object' || answer === null || !answer.baseFields || !answer.formatSpecificAnswers) {
        return res.status(400).json({ message: "La estructura de 'answer' es incorrecta. Debe contener 'baseFields' y 'formatSpecificAnswers'." });
    }
    // Validar que cada formatId en formatIds tenga una entrada en formatSpecificAnswers
    for (const formatId of formatIds) {
        if (!answer.formatSpecificAnswers.hasOwnProperty(formatId)) {
            return res.status(400).json({ message: `Faltan respuestas específicas para el formatId ${formatId} en 'answer.formatSpecificAnswers'.`});
        }
    }


    const newAnsweredRecord = new AnsweredClinicalRecord({
      clinicalRecordNumber,
      clinicalRecordName,
      email,
      answer, // Se guarda la nueva estructura de answer
      formatIds, // Se guarda el array de IDs de formato
      responseTime,
    });

    await newAnsweredRecord.save();
    res.status(201).json({ message: "Respuesta guardada con éxito", newAnsweredRecord });

  } catch (error) {
    console.error("Error al guardar la respuesta:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Error de validación", errors: error.errors });
    }
    res.status(500).json({ message: "Error al guardar la respuesta", error: error.message });
  }
});

// Eliminar una respuesta por su ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await AnsweredClinicalRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Respuesta no encontrada para eliminar" });
    }

    res.status(200).json({ message: "Respuesta eliminada exitosamente", deletedRecord });
  } catch (error) {
    console.error("Error al eliminar la respuesta:", error);
    res.status(500).json({ message: "Error al eliminar la respuesta", error: error.message });
  }
});

module.exports = router;