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
  const { feedback, teacherEmail } = req.body;
  const { id } = req.params;

  try {
    const answeredRecord = await AnsweredClinicalRecord.findById(id);
    if (!answeredRecord) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }

    answeredRecord.feedback = feedback;
    answeredRecord.teacherEmail = teacherEmail;
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
    const { clinicalRecordNumber, email, answer, formatId } = req.body;

    if (!clinicalRecordNumber || !email || !answer || !formatId) {
      return res.status(400).json({ message: "Faltan datos obligatorios (clinicalRecordNumber, email, answer, formatId)" });
    }

    const newAnsweredRecord = new AnsweredClinicalRecord({
      clinicalRecordNumber,
      email,
      answer,
      formatId,
    });

    await newAnsweredRecord.save();
    res.status(201).json({ message: "Respuesta guardada con éxito", newAnsweredRecord });

  } catch (error) {
    console.error("Error al guardar la respuesta:", error);
    res.status(500).json({ message: "Error al guardar la respuesta", error: error.message });
  }
});

module.exports = router;
