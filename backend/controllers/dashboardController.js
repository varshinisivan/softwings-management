// controllers/dashboardController.js
const Client = require("../models/Client");
exports.getDashboardOverview = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();

    const services = await Client.aggregate([
      { $unwind: "$services" },
      {
        $group: {
          _id: { $toLower: "$services.serviceType" },
          count: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$services.amount", 0] } },
        },
      },
    ]);

    let totalRevenue = 0;

    const serviceWise = {
      hosting: { count: 0, revenue: 0 },
      domain: { count: 0, revenue: 0 },
      ssl: { count: 0, revenue: 0 },
      amc: { count: 0, revenue: 0 },
    };

    services.forEach((service) => {
      const type = service._id;

      if (serviceWise[type]) {
        serviceWise[type].count = service.count;
        serviceWise[type].revenue = service.revenue;
      }

      totalRevenue += service.revenue;
    });

    res.status(200).json({
      totalClients,
      totalRevenue,
      serviceWise,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};