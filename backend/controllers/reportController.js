const Client = require("../models/Client");

// GET /api/reports/profit
exports.getProfitReport = async (req, res) => {
  try {
    const clients = await Client.find();

    let totalRevenue = 0;
    let totalExpenses = 0;

    const monthlyData = {};
    const serviceWise = {
      hosting: { count: 0, revenue: 0, profit: 0 },
      domain: { count: 0, revenue: 0, profit: 0 },
      ssl: { count: 0, revenue: 0, profit: 0 },
      amc: { count: 0, revenue: 0, profit: 0 },
    };

    clients.forEach(client => {
      client.services.forEach(service => {
        const amount = service.amount || 0;
        const expense = service.expense || 0;
        const startDate = new Date(service.startDate);

        // Aggregate total revenue and expenses
        totalRevenue += amount;
        totalExpenses += expense;

        // Monthly aggregation
        const monthKey = `${startDate.getFullYear()}-${startDate.getMonth()+1}`;
        if (!monthlyData[monthKey]) monthlyData[monthKey] = { revenue: 0, expense: 0, profit: 0 };
        monthlyData[monthKey].revenue += amount;
        monthlyData[monthKey].expense += expense;
        monthlyData[monthKey].profit += (amount - expense);

        // Service wise aggregation
        if(serviceWise[service.serviceType]){
          serviceWise[service.serviceType].count += 1;
          serviceWise[service.serviceType].revenue += amount;
          serviceWise[service.serviceType].profit += (amount - expense);
        }
      });
    });

    const monthlyOverview = Object.keys(monthlyData).map(month => ({
      month,
      revenue: monthlyData[month].revenue,
      expense: monthlyData[month].expense,
      profit: monthlyData[month].profit,
    }));

    res.status(200).json({
      totalRevenue,
      totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      monthlyOverview,
      serviceWise,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};