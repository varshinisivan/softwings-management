import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";
import { getClientById, updateService, deleteService, addService } from "../../api/clientapi";

interface Service {
  _id: string;
  serviceType: string;
  planName: string;
  durationMonths: number;
  durationYears: number;
  amount: number;
  startDate: string;
  endDate: string;
}

interface Client {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  address: string;
  services: Service[];
  totalAmount: number;
}

const ViewClient: React.FC = () => {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // ================= FETCH CLIENT =================
  const fetchClient = async () => {
    const data = await getClientById(id!);
    setClient(data);
  };

  useEffect(() => {
    fetchClient();
  }, []);

  // ================= STATUS LOGIC =================
  const getStatus = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "Expired";
    if (diff <= 30) return "Expiring Soon";
    return "Active";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Expiring Soon") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // ================= EDIT =================
  const handleEditClick = (service: Service) => {
    setEditingServiceId(service._id);
    setEditData({
      ...service,
      startDate: service.startDate.substring(0, 10),
      endDate: service.endDate.substring(0, 10),
    });
  };

  const handleSave = async () => {
    await updateService(id!, editingServiceId!, editData);
    setEditingServiceId(null);
    fetchClient();
  };

  const handleCancel = () => {
    setEditingServiceId(null);
    setEditData({});
  };

  // ================= DELETE =================
  const handleDelete = async (serviceId: string) => {
    if (!window.confirm("Delete this service?")) return;

    await deleteService(id!, serviceId);
    fetchClient();
  };

  // ================= ADD =================
  const handleAddService = async () => {
    await addService(id!, editData);
    setShowAddForm(false);
    setEditData({});
    fetchClient();
  };

  if (!client)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= CLIENT HEADER ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{client.companyName}</h1>
                <p className="text-gray-500 text-lg mt-1">{client.contactPerson}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p>{client.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Mobile</p>
                  <p>{client.mobile || "-"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-medium text-gray-700">Address</p>
                  <p>{client.address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-10 py-8 rounded-2xl text-center shadow-lg">
              <p className="uppercase text-xs tracking-wider opacity-80">Total Revenue</p>
              <h2 className="text-4xl font-bold mt-3">₹ {client.totalAmount}</h2>
            </div>
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Services</h2>

            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditData({});
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow"
            >
              <FaPlus size={14} /> Add Service
            </button>
          </div>

          {/* ================= ADD FORM ================= */}
          {showAddForm && (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-8 grid md:grid-cols-3 gap-5">
              <input
                placeholder="Service Type"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) =>
                  setEditData({ ...editData, serviceType: e.target.value })
                }
              />
              <input
                placeholder="Plan Name"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) =>
                  setEditData({ ...editData, planName: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Amount"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) =>
                  setEditData({ ...editData, amount: Number(e.target.value) })
                }
              />
              <input
                type="date"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) =>
                  setEditData({ ...editData, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) =>
                  setEditData({ ...editData, endDate: e.target.value })
                }
              />
              <button
                onClick={handleAddService}
                className="md:col-span-3 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Save Service
              </button>
            </div>
          )}

          {/* ================= SERVICES TABLE ================= */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500 uppercase text-xs tracking-wider">
                  <th className="py-3">Type</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {client.services.map((service) => {
                  const status = getStatus(service.endDate);
                  const isEditing = editingServiceId === service._id;

                  return (
                    <tr key={service._id} className="hover:bg-gray-50 transition">
                      <td className="py-4 capitalize font-medium text-gray-800">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.serviceType || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, serviceType: e.target.value })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          service.serviceType
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.planName || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, planName: e.target.value })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          service.planName
                        )}
                      </td>

                      <td className="font-semibold text-indigo-600">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.amount || 0}
                            onChange={(e) =>
                              setEditData({ ...editData, amount: Number(e.target.value) })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          `₹ ${service.amount}`
                        )}
                      </td>

                      <td className="text-gray-500">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={editData.startDate || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, startDate: e.target.value })
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                            <span>→</span>
                            <input
                              type="date"
                              value={editData.endDate || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, endDate: e.target.value })
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </div>
                        ) : (
                          `${service.startDate.substring(0, 10)} → ${service.endDate.substring(0, 10)}`
                        )}
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="flex justify-center gap-4 text-gray-500">
                          {isEditing ? (
                            <>
                              <button onClick={handleSave} className="hover:text-green-600 transition">
                                <FaSave />
                              </button>
                              <button onClick={handleCancel} className="hover:text-red-600 transition">
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditClick(service)} className="hover:text-indigo-600 transition">
                                <FaEdit />
                              </button>
                              <button onClick={() => handleDelete(service._id)} className="hover:text-red-600 transition">
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClient;