import React, { useEffect, useState } from "react";
import { getRenewals } from "../api/renewalapi";

interface ServiceRenewal {
  serviceType: string;
  serviceName: string;
  amount: number;
  expiryDate: string;
  daysRemaining: number;
}

interface Renewal {
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  services: ServiceRenewal[];
}

const RenewalReminder: React.FC = () => {
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [summary, setSummary] = useState({
    totalRenewals: 0,
    expectedRevenue: 0,
    urgentRenewals: 0,
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    console.log('Token exists:', !!token);
    if (!token) {
      console.log('No token found, skipping renewal fetch');
      return;
    }

    try {
      console.log('Fetching renewals...');
      const res = await getRenewals();
      console.log('Renewals response:', res);

      const clientMap: Record<string, Renewal> = {};
      res.data.renewals.forEach((r: any) => {
        console.log('Processing renewal:', r);
        if (!clientMap[r.companyName]) {
          clientMap[r.companyName] = {
            companyName: r.companyName,
            contactPerson: r.contactPerson,
            mobile: r.mobile,
            email: r.email,
            services: [],
          };
        }
        clientMap[r.companyName].services.push({
          serviceType: r.serviceType,
          serviceName: r.serviceName,
          amount: r.amount,
          expiryDate: r.expiryDate,
          daysRemaining: r.daysRemaining,
        });
      });

      const renewalArray = Object.values(clientMap);
      console.log('Final renewals array:', renewalArray);
      console.log('Summary:', {
        totalRenewals: res.data.totalRenewals,
        expectedRevenue: res.data.expectedRevenue,
        urgentRenewals: res.data.urgentRenewals,
      });

      setRenewals(renewalArray);
      setSummary({
        totalRenewals: res.data.totalRenewals,
        expectedRevenue: res.data.expectedRevenue,
        urgentRenewals: res.data.urgentRenewals,
      });
    } catch (error) {
      console.error('Error fetching renewals:', error);
    }
  };

  const filteredRenewals = renewals.filter((client) =>
    client.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRenewals = filteredRenewals.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredRenewals.length / itemsPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Renewal Dashboard
      </h2>

      {/* Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-3 rounded-xl w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="Total Renewals"
          value={summary.totalRenewals}
          gradient="from-blue-400 to-blue-600"
          icon="📄"
        />
        <SummaryCard
          title="Expected Revenue"
          value={`₹ ${summary.expectedRevenue.toLocaleString()}`}
          gradient="from-green-400 to-green-600"
          icon="💰"
        />
        <SummaryCard
          title="Urgent (≤ 7 Days)"
          value={summary.urgentRenewals}
          gradient="from-red-400 to-red-600"
          icon="⏰"
        />
      </div>

      {/* Client Cards */}
      <div className="grid gap-6">
        {currentRenewals.map((client, i) => {
          const isUrgent = client.services.some(
            (s) => s.daysRemaining <= 7
          );

          return (
            <div
              key={i}
              className={`bg-white shadow-lg rounded-2xl p-6 border-l-4 ${
                isUrgent ? "border-red-400" : "border-gray-200"
              } hover:shadow-2xl transition-shadow duration-300`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {client.companyName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {client.contactPerson} • {client.mobile}
                  </p>
                </div>
                {isUrgent && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Urgent
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {client.services.map((service, index) => {
                  const urgent = service.daysRemaining <= 7;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        urgent
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      } hover:scale-105 transform transition-all duration-200`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">
                          {service.serviceType} - {service.serviceName}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            urgent ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          {service.daysRemaining} days left
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          Expiry: {new Date(service.expiryDate).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-green-600">
                          ₹ {service.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {filteredRenewals.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No upcoming renewals 🎉
        </div>
      )}
    </div>
  );
};

export default RenewalReminder;

// ================= Summary Card Component =================
const SummaryCard = ({
  title,
  value,
  gradient,
  icon,
}: {
  title: string;
  value: string | number;
  gradient: string;
  icon: string;
}) => (
  <div
    className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${gradient} flex items-center justify-between hover:scale-105 transition-transform duration-300`}
  >
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);