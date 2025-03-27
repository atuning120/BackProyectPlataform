const mongoose = require("mongoose");

const clinicalRecordSchema = new mongoose.Schema(
  {
    clinicalRecordNumber: {
      type: Number,
      unique: true,
    },
    patientRun: {
      type: String,
      ref: "Patient",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const ClinicalRecord = mongoose.model("ClinicalRecord", clinicalRecordSchema);

module.exports = ClinicalRecord;
