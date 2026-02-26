const mongoose = require("mongoose");

// ================= Individual Service Schema =================
const individualServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Plan name or domain name
  duration: { type: Number, required: true }, // in years
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  amount: { type: Number, required: true },
});

// ================= Services Schema =================
const servicesSchema = new mongoose.Schema({
  hosting: [individualServiceSchema],
  domain: [individualServiceSchema],
  ssl: [individualServiceSchema],
  amc: [individualServiceSchema],
});

// ================= Client Schema =================
const clientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },

    services: servicesSchema,

    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
module.exports =
  mongoose.models.Client ||
  mongoose.model("Client", clientSchema);