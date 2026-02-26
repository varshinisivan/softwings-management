import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
  services: Record<string, ServiceItem[]>;
  totalAmount: number;
}

const ClientView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClient = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in");

      const response = await axios.get(`http://localhost:5000/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClient(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  // Check if a service is expiring in 30 days
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  if (loading) return <p className="p-6">Loading client...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!client) return <p className="p-6">Client not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Client Details</h2>

      <div className="mb-6">
        <p><strong>Company Name:</strong> {client.companyName}</p>
        <p><strong>Contact Person:</strong> {client.contactPerson}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Mobile:</strong> {client.mobile}</p>
        <p><strong>Address:</strong> {client.address}</p>
        <p><strong>Total Amount:</strong> ₹ {client.totalAmount}</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Services</h3>
      <div className="space-y-4">
        {client.services &&
          Object.entries(client.services).map(([type, items]) => {
            const serviceItems = Array.isArray(items) ? items : [];
            if (serviceItems.length === 0) return null;

            return (
              <div key={type} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <strong className="capitalize">{type}:</strong>
                {serviceItems.map((item, idx) => {
                  const expiring = isExpiringSoon(item.expiryDate);
                  return (
                    <div key={idx} className="mt-1">
                      <span>
                        {item.name} ({item.duration} yr) ₹{item.amount} |{" "}
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                      {expiring && (
                        <span className="ml-2 text-red-600 font-semibold">
                          ⚠ Renewal soon!
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/clients/edit/${client._id}`)}
        >
          Edit
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() => navigate("/clients")}
        >
          Back to All Clients
        </button>
      </div>
    </div>
  );
};

export default ClientView;