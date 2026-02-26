// src/pages/ClientManagement/AllClients.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ServiceItem {
  name: string;
  duration: number;
  amount: number;
  startDate: string;
  expiryDate: string;
}

interface Client {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  address: string;
  services?: Record<string, ServiceItem[]>;
  totalAmount: number;
}

const AllClients: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= Fetch Clients =================
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in");

      const response = await axios.get(
        "http://localhost:5000/api/clients",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || err.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ================= Delete Client =================
  const deleteClientHandler = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/clients/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchClients();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete client");
    }
  };

  // ================= Expiry Check =================
  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);

    const diff =
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diff <= 30;
  };

  // ================= Loading / Error =================
  if (loading) return <p className="p-6">Loading clients...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // ================= UI =================
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">All Clients</h2>

      {clients.length === 0 ? (
        <p>No clients found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white dark:bg-gray-900">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Contact</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Service Type</th>
                <th className="px-4 py-2 border">Service Name</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">Expiry Date</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.flatMap((client) => {
                const serviceEntries = client.services
                  ? Object.entries(client.services)
                  : [];

                if (serviceEntries.length === 0) {
                  return (
                    <tr key={client._id}>
                      <td className="px-4 py-2 border">
                        {client.companyName}
                      </td>
                      <td className="px-4 py-2 border">
                        {client.contactPerson}
                      </td>
                      <td className="px-4 py-2 border">{client.email}</td>
                      <td className="px-4 py-2 border">{client.mobile}</td>
                      <td
                        className="px-4 py-2 border text-center"
                        colSpan={6}
                      >
                        No Services
                      </td>
                      <td className="px-4 py-2 border flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/clients/view/${client._id}`)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/clients/edit/${client._id}`)
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            deleteClientHandler(client._id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }

                return serviceEntries.flatMap(([type, items]) => {
                  if (!Array.isArray(items) || items.length === 0)
                    return [];

                  return items.map((item, index) => (
                    <tr
                      key={`${client._id}-${type}-${index}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-2 border">
                        {client.companyName}
                      </td>
                      <td className="px-4 py-2 border">
                        {client.contactPerson}
                      </td>
                      <td className="px-4 py-2 border">
                        {client.email}
                      </td>
                      <td className="px-4 py-2 border">
                        {client.mobile}
                      </td>

                      <td className="px-4 py-2 border capitalize">
                        {type}
                      </td>
                      <td className="px-4 py-2 border">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 border">
                        {item.duration} yr
                      </td>
                      <td className="px-4 py-2 border">
                        {item.startDate
                          ? new Date(
                              item.startDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td
                        className={`px-4 py-2 border ${
                          item.expiryDate &&
                          isExpiringSoon(item.expiryDate)
                            ? "text-red-600 font-semibold"
                            : ""
                        }`}
                      >
                        {item.expiryDate
                          ? new Date(
                              item.expiryDate
                            ).toLocaleDateString()
                          : "-"}
                        {item.expiryDate &&
                          isExpiringSoon(item.expiryDate) &&
                          " ⚠️"}
                      </td>
                      <td className="px-4 py-2 border">
                        ₹ {item.amount}
                      </td>

                      <td className="px-4 py-2 border flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/clients/view/${client._id}`)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/clients/edit/${client._id}`)
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            deleteClientHandler(client._id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ));
                });
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllClients;