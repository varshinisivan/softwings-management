// controllers/renewalController.js
const Client = require("../models/client.js");

exports.getRenewals = async (req, res) => {
  try {
    console.log('Renewal request received');
    const clients = await Client.find();
    console.log('Total clients found:', clients.length);

    const today = new Date();
    console.log('Today date:', today.toISOString());

    let renewals = [];
    let expectedRevenue = 0;
    let urgentRenewals = 0;

    clients.forEach((client) => {
      console.log(`Processing client: ${client.companyName}, services: ${client.services ? client.services.length : 0}`);
      if (!client.services || client.services.length === 0) return;

      client.services.forEach((service) => {
        console.log(`Service: ${service.serviceType}, endDate: ${service.endDate}`);
        if (!service.endDate) return;

        const expiry = new Date(service.endDate);
        const daysRemaining = Math.ceil(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        console.log(`Days remaining for ${service.serviceType}: ${daysRemaining}`);

        renewals.push({
          clientId: client._id,
          companyName: client.companyName,
          contactPerson: client.contactPerson,
          mobile: client.mobile,
          email: client.email,
          serviceType: service.serviceType.toUpperCase(),
          serviceName: service.planName,
          amount: service.amount,
          expiryDate: service.endDate,
          daysRemaining,
        });

        expectedRevenue += service.amount || 0;

        if (daysRemaining <= 7 && daysRemaining >= 0) {
          urgentRenewals++;
        }
      });
    });

    console.log('Final results:', {
      totalRenewals: renewals.length,
      expectedRevenue,
      urgentRenewals
    });

    res.status(200).json({
      renewals,
      totalRenewals: renewals.length,
      expectedRevenue,
      urgentRenewals,
    });
  } catch (error) {
    console.error("Renewal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};