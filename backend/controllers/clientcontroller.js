const Client = require("../models/Client");


// ================= CREATE CLIENT =================
exports.createClient = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      mobile,
      address,
      services = [],
    } = req.body;

    const totalAmount = services.reduce(
      (sum, service) => sum + Number(service.amount || 0),
      0
    );

    const newClient = new Client({
      companyName,
      contactPerson,
      email,
      mobile,
      address,
      services,
      totalAmount,
    });

    await newClient.save();

    res.status(201).json({
      message: "Client created successfully",
      client: newClient,
    });
  } catch (error) {
    console.error("Create Client Error:", error);
    res.status(500).json({ message: "Error creating client" });
  }
};


// ================= GET ALL CLIENTS =================
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Fetch Clients Error:", error);
    res.status(500).json({ message: "Error fetching clients" });
  }
};


// ================= GET SINGLE CLIENT =================
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Fetch Single Client Error:", error);
    res.status(500).json({ message: "Error fetching client" });
  }
};


// ================= UPDATE CLIENT =================
exports.updateClient = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      mobile,
      address,
      services = [],
    } = req.body;

    const totalAmount = services.reduce(
      (sum, service) => sum + Number(service.amount || 0),
      0
    );

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        contactPerson,
        email,
        mobile,
        address,
        services,
        totalAmount,
      },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Update Client Error:", error);
    res.status(500).json({ message: "Error updating client" });
  }
};


// ================= DELETE CLIENT =================
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete Client Error:", error);
    res.status(500).json({ message: "Error deleting client" });
  }
};


// ======================================================
// ================= SERVICE MANAGEMENT =================
// ======================================================


// ================= ADD SERVICE =================
exports.addService = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.services.push(req.body);

    client.totalAmount = client.services.reduce(
      (sum, service) => sum + Number(service.amount || 0),
      0
    );

    await client.save();

    res.status(200).json({
      message: "Service added successfully",
      client,
    });
  } catch (error) {
    console.error("Add Service Error:", error);
    res.status(500).json({ message: "Error adding service" });
  }
};


// ================= UPDATE SINGLE SERVICE =================
exports.updateService = async (req, res) => {
  try {
    const { id, serviceId } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const service = client.services.id(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    Object.assign(service, req.body);

    client.totalAmount = client.services.reduce(
      (sum, service) => sum + Number(service.amount || 0),
      0
    );

    await client.save();

    res.status(200).json({
      message: "Service updated successfully",
      client,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({ message: "Error updating service" });
  }
};


// ================= DELETE SINGLE SERVICE =================
exports.deleteService = async (req, res) => {
  try {
    const { id, serviceId } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.services = client.services.filter(
      (service) => service._id.toString() !== serviceId
    );

    client.totalAmount = client.services.reduce(
      (sum, service) => sum + Number(service.amount || 0),
      0
    );

    await client.save();

    res.status(200).json({
      message: "Service deleted successfully",
      client,
    });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({ message: "Error deleting service" });
  }
};