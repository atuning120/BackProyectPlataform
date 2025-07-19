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
    console.error("Error obteniendo los pacientes:", err);
    res.status(500).json({ message: "Error obteniendo los pacientes.", error: err.message });
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
    console.error("Error obteniendo los datos del paciente:", err);
    res.status(500).json({ message: "Error obteniendo los datos del paciente.", error: err.message });
  }
});

// Crear un nuevo paciente
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error("Error creando el paciente:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "El RUN ya está registrado." });
    }
    res.status(500).json({ message: "Error creando el paciente.", error: err.message });
  }
});

// Eliminar múltiples pacientes (Ruta para eliminación en lote)
router.delete("/", async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Se requiere un array de IDs en el cuerpo de la solicitud." });
  }

  try {
    const patientsToDelete = await Patient.find({ _id: { $in: ids } }).select('run');
    if (patientsToDelete.length === 0) {
      return res.status(404).json({ message: "No se encontraron pacientes con los IDs proporcionados." });
    }

    const patientRuns = patientsToDelete.map(p => p.run);
    const associatedRecords = await ClinicalRecord.find({ patientRun: { $in: patientRuns } });

    if (associatedRecords.length > 0) {
      return res.status(400).json({ message: `No se pueden eliminar porque  paciente(s) tienen fichas clínicas asociadas.` });
    }

    const result = await Patient.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No se eliminó ningún paciente, puede que ya hayan sido eliminados." });
    }

    res.status(200).json({ message: `${result.deletedCount} pacientes han sido eliminados exitosamente.` });
  } catch (error) {
    console.error("Error en la eliminación masiva de pacientes:", error);
    res.status(500).json({ message: "Error al eliminar los pacientes", error: error.message });
  }
});

// Eliminar un paciente por su ID (Ruta individual)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    const clinicalRecords = await ClinicalRecord.find({ patientRun: patient.run });
    if (clinicalRecords.length > 0) {
      return res.status(400).json({ message: "No se puede eliminar el paciente porque tiene fichas clínicas asociadas." });
    }

    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }
    res.status(200).json({ message: "Paciente eliminado exitosamente." });
  } catch (err) {
    console.error("Error eliminando el paciente:", err);
    res.status(500).json({ message: "Error eliminando el paciente.", error: err.message });
  }
});

module.exports = router;