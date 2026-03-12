import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from "recharts";
import { getProfitReport } from "../../api/reportsapi";

interface MonthlyData {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}

interface ServicePlanData {
  [planName: string]: {
    count: number;
    revenue: number;
    profit: number;
  };
}

interface ServiceWiseData {
  [serviceType: string]: {
    count: number;
    revenue: number;
    profit: number;
    plans: ServicePlanData;
  };
}

interface ReportData {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  monthlyOverview: MonthlyData[];
  serviceWise: ServiceWiseData;
}

const serviceColors: Record<string, string> = {
  hosting: "#3B82F6",
  domain: "#10B981",
  ssl: "#8B5CF6",
  amc: "#F59E0B",
};

const ProfitReport: React.FC = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const data = await getProfitReport();
      setReport(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold animate-pulse text-gray-500">
          Loading report...
        </div>
      </div>
    );

  if (!report)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No report data found.
      </div>
    );

  const serviceChartData = Object.keys(report.serviceWise).map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    ...report.serviceWise[type],
  }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Profit & Financial Report
        </h1>
        <p className="text-gray-500 mt-1">
          Complete financial overview of your services
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl rounded-3xl p-8 transform hover:scale-105 transition duration-300">
          <h4 className="text-sm uppercase tracking-wide opacity-80">
            Total Revenue
          </h4>
          <h2 className="text-3xl font-bold mt-4">
            ₹{report.totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl rounded-3xl p-8 transform hover:scale-105 transition duration-300">
          <h4 className="text-sm uppercase tracking-wide opacity-80">
            Total Expenses
          </h4>
          <h2 className="text-3xl font-bold mt-4">
            ₹{report.totalExpenses.toLocaleString()}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-xl rounded-3xl p-8 transform hover:scale-105 transition duration-300">
          <h4 className="text-sm uppercase tracking-wide opacity-80">
            Total Profit
          </h4>
          <h2 className="text-3xl font-bold mt-4">
            ₹{report.totalProfit.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Monthly Financial Overview
        </h3>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={report.monthlyOverview}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Service Wise Profit */}
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Service Wise Profit
        </h3>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={serviceChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />

            <Tooltip
              formatter={(value) =>
                typeof value === "number"
                  ? `₹${value.toLocaleString()}`
                  : value
              }
            />

            <Bar dataKey="profit" radius={[8, 8, 0, 0]}>
              {serviceChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={serviceColors[entry.name.toLowerCase()] || "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ProfitReport;