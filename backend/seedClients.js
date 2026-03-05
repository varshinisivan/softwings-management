const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Client = require("./models/Client");

dotenv.config();

// -------------------------
// MongoDB Connection
// -------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/softwings";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------------
// Sample Clients Data
// -------------------------
const clients = [
  {
    companyName: "Softwings Technologies",
    contactPerson: "Varshini Sivan",
    email: "varshini@softwings.com",
    mobile: "9876543210",
    services: [
      {
        serviceType: "hosting",
        planName: "Basic Hosting",
        startDate: new Date("2026-01-05"),
        endDate: new Date("2027-01-04"),
        amount: 5000,
        expense: 2000,
        durationMonths: 12,
        durationYears: 1,
      },
      {
        serviceType: "domain",
        planName: ".com Domain",
        startDate: new Date("2026-02-15"),
        endDate: new Date("2027-02-14"),
        amount: 1200,
        expense: 300,
        durationMonths: 12,
        durationYears: 1,
      },
    ],
  },
  {
    companyName: "TechNova Solutions",
    contactPerson: "Arun Kumar",
    email: "arun@technova.com",
    mobile: "9123456780",
    services: [
      {
        serviceType: "ssl",
        planName: "Standard SSL",
        startDate: new Date("2026-03-10"),
        endDate: new Date("2027-03-09"),
        amount: 1500,
        expense: 500,
        durationMonths: 12,
        durationYears: 1,
      },
      {
        serviceType: "amc",
        planName: "Annual Maintenance",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        amount: 8000,
        expense: 4000,
        durationMonths: 12,
        durationYears: 1,
      },
    ],
  },
  {
    companyName: "NextGen Softwares",
    contactPerson: "Priya Sharma",
    email: "priya@nextgen.com",
    mobile: "9988776655",
    services: [
      {
        serviceType: "hosting",
        planName: "Pro Hosting",
        startDate: new Date("2026-02-01"),
        endDate: new Date("2027-01-31"),
        amount: 10000,
        expense: 6000,
        durationMonths: 12,
        durationYears: 1,
      },
      {
        serviceType: "domain",
        planName: ".net Domain",
        startDate: new Date("2026-04-01"),
        endDate: new Date("2027-03-31"),
        amount: 1500,
        expense: 400,
        durationMonths: 12,
        durationYears: 1,
      },
    ],
  },
];

// -------------------------
// Insert Clients
// -------------------------
const seedClients = async () => {
  try {
    await Client.deleteMany(); // ✅ Clear old data
    const inserted = await Client.insertMany(clients);
    console.log(`Inserted ${inserted.length} clients successfully!`);
    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.disconnect();
  }
};

seedClients();