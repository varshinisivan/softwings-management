const mongoose = require("mongoose");

// ================= SERVICE SCHEMA =================
const serviceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    enum: ["hosting", "domain", "ssl", "amc"],
  },
  planName: {
    type: String,
    required: true,
  },
  durationMonths: {
    type: Number,
    default: 0,
  },
  durationYears: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    default: 0, // ✅ NEW: Expense field for profit calculations
  },
});

// ================= CLIENT SCHEMA =================
const clientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    services: [serviceSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalProfit: {
      type: Number,
      default: 0, // ✅ NEW: Store profit per client
    },
  },
  { timestamps: true }
);

// ✅ AUTO CALCULATE TOTAL AMOUNT AND PROFIT
clientSchema.pre("save", function () {
  if (this.services && this.services.length > 0) {
    // Total revenue
    this.totalAmount = this.services.reduce(
      (total, service) => total + (service.amount || 0),
      0
    );

    // Total profit
    this.totalProfit = this.services.reduce(
      (total, service) => total + ((service.amount || 0) - (service.expense || 0)),
      0
    );
  } else {
    this.totalAmount = 0;
    this.totalProfit = 0;
  }
});

module.exports =
  mongoose.models.Client || mongoose.model("Client", clientSchema);