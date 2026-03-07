import { useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import MonthlyProfitOverview from "../reports/MonthlyProfitOverview";
import { getDashboardOverview } from "../../api/dashboardapi";

import { FaServer, FaGlobe, FaLock, FaTools } from "react-icons/fa";
import CountUp from "react-countup";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface ServiceWise {
  hosting: { count: number; revenue: number };
  domain: { count: number; revenue: number };
  ssl: { count: number; revenue: number };
  amc: { count: number; revenue: number };
}

interface DashboardData {
  totalClients: number;
  totalRevenue: number;
  serviceWise: ServiceWise;
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardOverview();
      setDashboard(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );
  }

  const chartData = [
    { name: "Hosting", value: dashboard?.serviceWise.hosting.count ?? 0 },
    { name: "Domain", value: dashboard?.serviceWise.domain.count ?? 0 },
    { name: "SSL", value: dashboard?.serviceWise.ssl.count ?? 0 },
    { name: "AMC", value: dashboard?.serviceWise.amc.count ?? 0 },
  ];

  const revenueData = [
    { name: "Hosting", revenue: dashboard?.serviceWise.hosting.revenue ?? 0 },
    { name: "Domain", revenue: dashboard?.serviceWise.domain.revenue ?? 0 },
    { name: "SSL", revenue: dashboard?.serviceWise.ssl.revenue ?? 0 },
    { name: "AMC", revenue: dashboard?.serviceWise.amc.revenue ?? 0 },
  ];

  const COLORS = ["#3B82F6", "#22C55E", "#A855F7", "#F97316"];

  return (
    <>
      <PageMeta
        title="Dashboard | Client Management"
        description="Client Service Dashboard"
      />

      <div className="bg-gray-100 min-h-screen p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Business Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Overview of services, revenue and performance
            </p>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <ServiceCard
            title="Hosting"
            icon={<FaServer />}
            count={dashboard?.serviceWise.hosting.count ?? 0}
            revenue={dashboard?.serviceWise.hosting.revenue ?? 0}
            gradient="from-blue-500 to-blue-700"
          />

          <ServiceCard
            title="Domain"
            icon={<FaGlobe />}
            count={dashboard?.serviceWise.domain.count ?? 0}
            revenue={dashboard?.serviceWise.domain.revenue ?? 0}
            gradient="from-green-500 to-green-700"
          />

          <ServiceCard
            title="SSL"
            icon={<FaLock />}
            count={dashboard?.serviceWise.ssl.count ?? 0}
            revenue={dashboard?.serviceWise.ssl.revenue ?? 0}
            gradient="from-purple-500 to-purple-700"
          />

          <ServiceCard
            title="AMC"
            icon={<FaTools />}
            count={dashboard?.serviceWise.amc.count ?? 0}
            revenue={dashboard?.serviceWise.amc.revenue ?? 0}
            gradient="from-orange-500 to-orange-700"
          />
        </div>

        {/* Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-12 border">
          <h2 className="text-2xl font-semibold mb-8">Business Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OverviewStat label="Total Clients" value={dashboard?.totalClients ?? 0} />
            <OverviewStat label="Total Revenue" value={dashboard?.totalRevenue ?? 0} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Service Distribution</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={100} label>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Revenue by Service</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Renewal Table */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6">Upcoming Renewals</h2>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Expiry</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">ABC Company</td>
                <td className="p-3">Hosting</td>
                <td className="p-3">2026-03-25</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                    Expiring Soon
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

          <div className="space-y-5">
            <Activity text="New client added - ABC Technologies" color="bg-green-500" />
            <Activity text="Hosting activated for XYZ Solutions" color="bg-blue-500" />
            <Activity text="Domain renewal due for ABC Company" color="bg-yellow-500" />
          </div>
        </div>

        {/* Monthly Profit */}
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-2xl font-semibold mb-8">
            Monthly Revenue Overview
          </h2>

          <MonthlyProfitOverview />
        </div>

      </div>
    </>
  );
}

/* Service Card */
function ServiceCard({ title, count, revenue, gradient, icon }: any) {
  return (
    <div
      className={`rounded-3xl p-7 text-white bg-gradient-to-r ${gradient}
      shadow-xl hover:shadow-2xl hover:-translate-y-1 transition`}
    >
      <div className="flex justify-between">
        <h3 className="text-sm uppercase">{title}</h3>
        <div className="text-xl">{icon}</div>
      </div>

      <p className="text-4xl font-bold mt-4">{count}</p>

      <div className="mt-5 text-sm">
        Revenue: ₹ {revenue.toLocaleString()}
      </div>
    </div>
  );
}

/* KPI Card */
function OverviewStat({ label, value }: any) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100
    p-8 rounded-2xl border shadow-md">

      <p className="text-gray-500 text-sm uppercase">{label}</p>

      <p className="text-4xl font-bold mt-3">
        <CountUp end={value} duration={2} separator="," />
      </p>
    </div>
  );
}

/* Activity */
function Activity({ text, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <p>{text}</p>
    </div>
  );
}