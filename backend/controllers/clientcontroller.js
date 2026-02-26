// controllers/clientController.js
const Client = require("../models/Client");
const asyncHandler = require("express-async-handler");

// ===== Helper: Format services =====
const formatServices = (services) => {
  const formatCategory = (items = []) =>
    items
      .filter(
        (item) =>
          item.name &&
          item.startDate &&
          item.expiryDate &&
          item.amount !== undefined
      )
      .map((item) => ({
        name: item.name,
        duration: Number(item.duration),
        startDate: new Date(item.startDate),
        expiryDate: new Date(item.expiryDate),
        amount: Number(item.amount),
      }));

  return {
    hosting: formatCategory(services?.hosting),
    domain: formatCategory(services?.domain),
    ssl: formatCategory(services?.ssl),
    amc: formatCategory(services?.amc),
  };
};

// ===== Add Client =====
const addClient = asyncHandler(async (req, res) => {
  const { company, services, totalAmount } = req.body;

  if (
    !company ||
    !company.companyName ||
    !company.contactPerson ||
    !company.mobile ||
    !company.email ||
    !company.address
  ) {
    res.status(400);
    throw new Error("Please fill all required company details");
  }

  const client = new Client({
    companyName: company.companyName,
    contactPerson: company.contactPerson,
    email: company.email,
    mobile: company.mobile,
    address: company.address,
    services: formatServices(services),
    totalAmount: Number(totalAmount) || 0,
  });

  const savedClient = await client.save();
  res.status(201).json(savedClient); // plain object for frontend
});

// ===== Get All Clients =====
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find().sort({ createdAt: -1 });
  res.status(200).json(clients); // plain array for frontend
});

// ===== Get Single Client =====
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  res.status(200).json(client);
});

// ===== Update Client =====
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  const { company, services, totalAmount } = req.body;

  if (company) {
    client.companyName = company.companyName || client.companyName;
    client.contactPerson = company.contactPerson || client.contactPerson;
    client.email = company.email || client.email;
    client.mobile = company.mobile || client.mobile;
    client.address = company.address || client.address;
  }

  if (services) client.services = formatServices(services);

  if (totalAmount !== undefined) client.totalAmount = Number(totalAmount);

  const updatedClient = await client.save();
  res.status(200).json(updatedClient);
});

// ===== Delete Client =====
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }
  await client.deleteOne();
  res.status(200).json({ message: "Client deleted successfully" });
});

// ===== Optional: Check Email Exists =====
const checkEmailExists = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }
  const client = await Client.findOne({ email });
  res.status(200).json({ exists: !!client });
});

module.exports = {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  checkEmailExists,
};