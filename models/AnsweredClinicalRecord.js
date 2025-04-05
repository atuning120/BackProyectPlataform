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
      type: String,
    },
  },
  { timestamps: true }
);

const AnsweredClinicalRecord = mongoose.model("AnsweredClinicalRecord", answeredClinicalRecordSchema);

module.exports = AnsweredClinicalRecord;
