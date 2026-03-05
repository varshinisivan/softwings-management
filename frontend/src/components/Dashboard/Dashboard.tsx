import { useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import MonthlyProfitOverview from "../reports/MonthlyProfitOverview";
import { getDashboardOverview } from "../../api/dashboardapi";

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
      <div className="p-10 text-center text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Dashboard | Client Management"
        description="Client Service Dashboard"
      />

      <div className="p-8 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Business Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Overview of services, revenue and performance
          </p>
        </div>

        {/* ================= Service Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <ServiceCard
            title="Hosting"
            count={dashboard?.serviceWise?.hosting?.count ?? 0}
            revenue={dashboard?.serviceWise?.hosting?.revenue ?? 0}
            gradient="from-blue-500 to-blue-600"
          />

          <ServiceCard
            title="Domain"
            count={dashboard?.serviceWise?.domain?.count ?? 0}
            revenue={dashboard?.serviceWise?.domain?.revenue ?? 0}
            gradient="from-green-500 to-green-600"
          />

          <ServiceCard
            title="SSL"
            count={dashboard?.serviceWise?.ssl?.count ?? 0}
            revenue={dashboard?.serviceWise?.ssl?.revenue ?? 0}
            gradient="from-purple-500 to-purple-600"
          />

          <ServiceCard
            title="AMC"
            count={dashboard?.serviceWise?.amc?.count ?? 0}
            revenue={dashboard?.serviceWise?.amc?.revenue ?? 0}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* ================= Overview Section ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Business Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OverviewStat
              label="Total Clients"
              value={dashboard?.totalClients ?? 0}
            />
            <OverviewStat
              label="Total Revenue"
              value={`₹ ${dashboard?.totalRevenue?.toLocaleString() ?? 0}`}
            />
          </div>
        </div>

        {/* ================= Monthly Profit Chart ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Monthly Revenue Overview
          </h2>
          <MonthlyProfitOverview />
        </div>
      </div>
    </>
  );
}

// ================= Service Card =================
function ServiceCard({
  title,
  count,
  revenue,
  gradient,
}: {
  title: string;
  count: number;
  revenue: number;
  gradient: string;
}) {
  return (
    <div
      className={`rounded-3xl p-6 text-white bg-gradient-to-r ${gradient} shadow-lg hover:scale-105 transition-all duration-300`}
    >
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
      <div className="mt-4 text-sm opacity-90">
        Revenue: ₹ {revenue.toLocaleString()}
      </div>
    </div>
  );
}

// ================= Overview Stat =================
function OverviewStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-3 text-gray-800">{value}</p>
    </div>
  );
}