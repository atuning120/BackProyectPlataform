const mongoose = require("mongoose");

const answeredClinicalRecordSchema = new mongoose.Schema(
  {
    clinicalRecordNumber: {
      type: Number,
      ref: "ClinicalRecord",
    },
    email: {
      type: String,
    },
    answer: { 
      type: Object, 
      required: true,
    },
    teacherEmail: {
      type: String,
    },
    feedback: {
      type: mongoose.Schema.Types.Mixed,
    },
    formatIds: [{ // Cambiado de formatId a formatIds
      type: Number,
      required: true,
    }],
    responseTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AnsweredClinicalRecord = mongoose.model("AnsweredClinicalRecord", answeredClinicalRecordSchema);

module.exports = AnsweredClinicalRecord;