import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

const ClientEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState<any>({}); // for editable fields

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClient(res.data);
        setForm(res.data); // initialize form with client data
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch client");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/clients/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Client updated successfully!");
      navigate("/clients");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update client");
    }
  };

  if (loading) return <p>Loading client...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!client) return <p>No client found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Client</h2>

      <div className="mb-3">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={form.companyName || ""}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-3">
        <label>Contact Person</label>
        <input
          type="text"
          name="contactPerson"
          value={form.contactPerson || ""}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email || ""}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-3">
        <label>Mobile</label>
        <input
          type="text"
          name="mobile"
          value={form.mobile || ""}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-3">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={form.address || ""}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-3">
        <label>Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          value={form.totalAmount || 0}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-3 py-1 rounded mt-4"
      >
        Save Changes
      </button>
      <button
        onClick={() => navigate("/clients")}
        className="bg-gray-500 text-white px-3 py-1 rounded mt-4 ml-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default ClientEdit;