import React, { useEffect, useState } from "react";
import { getRenewals } from "../api/renewalApi";

interface Renewal {
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  serviceType: string;
  serviceName: string;
  amount: number;
  expiryDate: string;
  daysRemaining: number;
}

const RenewalReminder: React.FC = () => {
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [summary, setSummary] = useState({
    totalRenewals: 0,
    expectedRevenue: 0,
    urgentRenewals: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await getRenewals(token);

    setRenewals(res.data.renewals);
    setSummary({
      totalRenewals: res.data.totalRenewals,
      expectedRevenue: res.data.expectedRevenue,
      urgentRenewals: res.data.urgentRenewals,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">
        Renewal Reminder
      </h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-xl">
          <h4>Total Renewals</h4>
          <p className="text-2xl font-bold">
            {summary.totalRenewals}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-xl">
          <h4>Expected Revenue</h4>
          <p className="text-2xl font-bold">
            ₹ {summary.expectedRevenue}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl">
          <h4>Urgent (≤ 7 Days)</h4>
          <p className="text-2xl font-bold">
            {summary.urgentRenewals}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Mobile</th>
              <th className="border px-4 py-2">Service</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Expiry</th>
              <th className="border px-4 py-2">Days Left</th>
            </tr>
          </thead>
          <tbody>
            {renewals.map((r, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{r.companyName}</td>
                <td className="border px-4 py-2">{r.contactPerson}</td>
                <td className="border px-4 py-2">{r.mobile}</td>
                <td className="border px-4 py-2">
                  {r.serviceType} - {r.serviceName}
                </td>
                <td className="border px-4 py-2">₹ {r.amount}</td>
                <td className="border px-4 py-2">
                  {new Date(r.expiryDate).toLocaleDateString()}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    r.daysRemaining <= 7
                      ? "text-red-600 font-bold"
                      : ""
                  }`}
                >
                  {r.daysRemaining} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RenewalReminder;