const mongoose = require("mongoose");

const clinicalRecordSchema = new mongoose.Schema(
  {
    patientRun: {
      type: String,
      required: true,
      ref: "Patient", // Se relaciona con el modelo Patient
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Agrega timestamps de creación y actualización
);

const ClinicalRecord = mongoose.model("ClinicalRecord", clinicalRecordSchema);

module.exports = ClinicalRecord;
