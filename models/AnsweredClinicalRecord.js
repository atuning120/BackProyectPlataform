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
    },
    teacherEmail: {
      type: String,
    },
    feedback: {
      type: mongoose.Schema.Types.Mixed,
    },
    formatId: {
      type: Number, 
      required: true,
    },
    responseTime: { 
      type: String, 
      required: true, 
    },
  },
  { timestamps: true }
);

const AnsweredClinicalRecord = mongoose.model("AnsweredClinicalRecord", answeredClinicalRecordSchema);

module.exports = AnsweredClinicalRecord;