import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { getAllClients, deleteClient } from "../../api/clientapi";

interface Service {
  serviceType: "hosting" | "domain" | "ssl" | "amc";
  planName: string;
  endDate?: string;
}

interface Client {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  services: Service[];
  totalAmount: number;
}

const ITEMS_PER_PAGE = 5;

const AllClients: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH CLIENTS =================
  const fetchClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ================= DELETE CLIENT =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await deleteClient(id);
      fetchClients();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ================= DATE UTILS =================
  const calculateDaysLeft = (endDate?: string) => {
    if (!endDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(endDate);
    expiry.setHours(0, 0, 0, 0);

    if (isNaN(expiry.getTime())) return null;

    const diff = expiry.getTime() - today.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getNearestExpiry = (services: Service[]) => {
    const valid = services.filter(
      (s) => s.endDate && !isNaN(new Date(s.endDate).getTime())
    );

    if (valid.length === 0) return null;

    return valid.reduce((prev, curr) =>
      new Date(prev.endDate!) < new Date(curr.endDate!)
        ? prev
        : curr
    );
  };

  const getRenewalStatus = (days: number | null) => {
    if (days === null) return "No Date";

    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days <= 30) return "Expiring Soon";
    return "Active";
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      Active: "bg-green-100 text-green-700",
      "Expiring Soon": "bg-yellow-100 text-yellow-700",
      Expired: "bg-red-100 text-red-700",
      Today: "bg-orange-100 text-orange-700",
      "No Date": "bg-gray-100 text-gray-600",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  // ================= SEARCH & FILTER =================
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesService =
        serviceFilter === "all" ||
        client.services.some((s) => s.serviceType === serviceFilter);

      return matchesSearch && matchesService;
    });
  }, [clients, searchTerm, serviceFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, serviceFilter]);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Clients Overview
          </h2>

          <div className="flex gap-4 flex-wrap">

            {/* SEARCH */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search client..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FILTER */}
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="hosting">Hosting</option>
              <option value="domain">Domain</option>
              <option value="ssl">SSL</option>
              <option value="amc">AMC</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Company</th>
                  <th className="p-4 text-left">Contact</th>
                  <th className="p-4 text-left">Services</th>
                  <th className="p-4 text-center">Renewal Status</th>
                  <th className="p-4 text-center">Total</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedClients.map((client) => {
                  const nearest = getNearestExpiry(client.services);
                  const days = calculateDaysLeft(nearest?.endDate);
                  const status = getRenewalStatus(days);

                  return (
                    <tr
                      key={client._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-semibold">
                        {client.companyName}
                      </td>

                      <td className="p-4 text-gray-600">
                        {client.contactPerson}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {client.services.map((service, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-600 capitalize"
                            >
                              {service.serviceType}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        {getStatusBadge(status)}
                      </td>

                      <td className="p-4 text-center font-bold text-indigo-600">
                        ₹ {client.totalAmount}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-5 text-lg">
                          <FaEye
                            onClick={() =>
                              navigate(`/clients/view/${client._id}`)
                            }
                            className="text-blue-500 cursor-pointer hover:scale-110"
                          />
                          <FaEdit
                            onClick={() =>
                              navigate(`/clients/edit/${client._id}`)
                            }
                            className="text-yellow-500 cursor-pointer hover:scale-110"
                          />
                          <FaTrash
                            onClick={() =>
                              handleDelete(client._id)
                            }
                            className="text-red-500 cursor-pointer hover:scale-110"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllClients;