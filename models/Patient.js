const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    run: { type: String, unique: true },
    gender: { type: String },
    age: { type: Number },
    insurance: { type: String },
    address: { type: String },
    mobileNumber: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
