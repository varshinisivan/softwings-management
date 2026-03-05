import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getProfitReport } from "../../api/reportsapi";

interface MonthlyData {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}

export default function MonthlyProfitOverview() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const report = await getProfitReport();
      setData(report.monthlyOverview || []);
    } catch (error) {
      console.error("Failed to fetch monthly overview:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading chart...</div>;

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Profit Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#4f46e5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}