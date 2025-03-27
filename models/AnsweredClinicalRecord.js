const mongoose = require("mongoose");

const answeredClinicalRecordSchema = new mongoose.Schema(
  {
    clinicalRecordNumber: {
      type: Number,
      required: true,
      ref: "ClinicalRecord",
    },
    email: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    teacherEmail: {
      type: String,
      required: false,
    },
    feedback: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const AnsweredClinicalRecord = mongoose.model("AnsweredClinicalRecord", answeredClinicalRecordSchema);

module.exports = AnsweredClinicalRecord;
