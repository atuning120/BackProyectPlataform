const express = require("express");
const Patient = require("../models/Patient");
const ClinicalRecord = require("../models/ClinicalRecord");
const AnsweredClinicalRecord = require("../models/AnsweredClinicalRecord");
const router = express.Router();

// Obtener todas las fichas clínicas
router.get("/", async (req, res) => {
  try {
    const clinicalRecords = await ClinicalRecord.find();
    res.status(200).json(clinicalRecords);
  } catch (error) {
    console.error("Error al obtener las fichas clínicas:", error);
    res.status(500).json({ message: "Error al obtener las fichas clínicas.", error: error.message });
  }
});

// Obtener una ficha clínica por su número de ficha
router.get("/:clinicalRecordNumber", async (req, res) => {
  const { clinicalRecordNumber } = req.params; // Obtener el clinicalRecordNumber del parámetro de la URL

  try {
    // Buscar la ficha clínica por su clinicalRecordNumber
    const clinicalRecord = await ClinicalRecord.findOne({ clinicalRecordNumber });

    if (!clinicalRecord) {
      return res.status(404).json({ message: "Ficha clínica no encontrada." });
    }

    // Si existe, devolverla
    res.status(200).json(clinicalRecord);
  } catch (error) {
    console.error("Error obteniendo la ficha clínica:", error);
    res.status(500).json({ message: "Error al obtener la ficha clínica.", error: error.message });
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

// Eliminar múltiples fichas clínicas (Ruta para eliminación en lote)
router.delete("/", async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Se requiere un array de IDs en el cuerpo de la solicitud." });
  }

  try {
    const recordsToDelete = await ClinicalRecord.find({ _id: { $in: ids } }).select('clinicalRecordNumber');
    if (recordsToDelete.length === 0) {
      return res.status(404).json({ message: "No se encontraron fichas clínicas con los IDs proporcionados." });
    }

    const recordNumbers = recordsToDelete.map(r => r.clinicalRecordNumber);
    const associatedAnswers = await AnsweredClinicalRecord.find({ clinicalRecordNumber: { $in: recordNumbers } });

    if (associatedAnswers.length > 0) {
      return res.status(400).json({ message: `No se pueden eliminar porque ${associatedAnswers.length} ficha(s) tienen respuestas asociadas.` });
    }

    const result = await ClinicalRecord.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No se eliminó ninguna ficha, puede que ya hayan sido eliminadas." });
    }

    res.status(200).json({ message: `${result.deletedCount} fichas clínicas han sido eliminadas exitosamente.` });
  } catch (error) {
    console.error("Error en la eliminación masiva de fichas clínicas:", error);
    res.status(500).json({ message: "Error al eliminar las fichas clínicas", error: error.message });
  }
});

// Eliminar una ficha clínica por su ID (Ruta individual)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const clinicalRecord = await ClinicalRecord.findById(id);
    if (!clinicalRecord) {
      return res.status(404).json({ message: "Ficha clínica no encontrada." });
    }

    const answeredRecords = await AnsweredClinicalRecord.find({ clinicalRecordNumber: clinicalRecord.clinicalRecordNumber });
    if (answeredRecords.length > 0) {
      return res.status(400).json({ message: "No se puede eliminar la ficha clínica porque tiene respuestas asociadas." });
    }

    const deletedRecord = await ClinicalRecord.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Ficha clínica no encontrada." });
    }
    res.status(200).json({ message: "Ficha clínica eliminada exitosamente." });
  } catch (err) {
    console.error("Error eliminando la ficha clínica:", err);
    res.status(500).json({ message: "Error eliminando la ficha clínica.", error: err.message });
  }
});

module.exports = router;