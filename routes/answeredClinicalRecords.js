const express = require("express");
const ClinicalRecord = require("../models/ClinicalRecord");
const AnsweredClinicalRecord = require("../models/AnsweredClinicalRecord");

const router = express.Router();

// Obtener todas las respuestas de fichas clínicas
router.get("/", async (req, res) => {
    try {
      const answeredRecords = await AnsweredClinicalRecord.find();
      res.status(200).json(answeredRecords);
    } catch (error) {
      console.error("Error obteniendo las respuestas:", error);
      res.status(500).json({ message: "Error al obtener las respuestas", error: error.message });
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

// Obtener respuestas de una ficha clínica por el email del profesor
router.get("/teacher/:teacherEmail", async (req, res) => {
    const { teacherEmail } = req.params; // Obtener el email del profesor desde la URL

    try {
      // Buscar las respuestas asociadas al teacherEmail
      const answeredRecords = await AnsweredClinicalRecord.find({ teacherEmail });
      res.status(200).json(answeredRecords); // Retornar las respuestas encontradas
    } catch (error) {
      console.error("Error obteniendo las respuestas por teacherEmail:", error);
      res.status(500).json({ message: "Error al obtener las respuestas", error: error.message });
    }
});

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

// Actualizar retroalimentación de una respuesta de ficha clínica
router.put("/:id", async (req, res) => {
    const { feedback, teacherEmail } = req.body;
    const { id } = req.params; // Obtener el id de la respuesta a actualizar
  
    try {
      // Verificar si la respuesta existe
      const answeredRecord = await AnsweredClinicalRecord.findById(id);
      if (!answeredRecord) {
        return res.status(404).json({ message: "Respuesta no encontrada" });
      }
  
      // Actualizar el feedback y teacherEmail (en caso de que sea necesario)
      answeredRecord.feedback = feedback;
      answeredRecord.teacherEmail = teacherEmail;
  
      // Guardar los cambios
      await answeredRecord.save();
  
      res.status(200).json(answeredRecord); // Devolver la respuesta actualizada
    } catch (err) {
      console.error("Error al actualizar la retroalimentación:", err);
      res.status(500).json({ message: "Error al actualizar la retroalimentación", error: err.message });
    }
});

module.exports = router;
