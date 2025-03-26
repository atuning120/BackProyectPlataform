const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    run: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Masculino", "Femenino", "Otro"], required: true },
    age: { type: Number, min: 0, max: 120, required: true },
    insurance: { type: String, enum: ["Fonasa", "Isapre"], required: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, match: /\S+@\S+\.\S+/ }
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
