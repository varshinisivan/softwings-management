// controllers/dashboardController.js
const Client = require("../models/client.js");

exports.getDashboardOverview = async (req, res) => {
  try {
    const clients = await Client.find();

    let totalRevenue = 0;

    const serviceWise = {
      hosting: { count: 0, revenue: 0 },
      domain: { count: 0, revenue: 0 },
      ssl: { count: 0, revenue: 0 },
      amc: { count: 0, revenue: 0 },
    };

    clients.forEach((client) => {
      if (!client.services || client.services.length === 0) return;

      client.services.forEach((service) => {
        const type = service.serviceType.toLowerCase();
        if (serviceWise[type]) {
          serviceWise[type].count += 1;
          serviceWise[type].revenue += service.amount || 0;
          totalRevenue += service.amount || 0;
        }
      });
    });

    res.status(200).json({
      totalClients: clients.length,
      totalRevenue,
      serviceWise,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};