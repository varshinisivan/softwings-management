import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ServiceItem {
  name: string;
  duration: string;
  amount: number;
  startDate: string;
  expiryDate: string;
}

const AddClient: React.FC = () => {
  const navigate = useNavigate();

  // ================= Company State =================
  const [company, setCompany] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    address: "",
  });

  // ================= Services State =================
  const [services, setServices] = useState<Record<string, ServiceItem[]>>({
    hosting: [],
    domain: [],
    ssl: [],
    amc: [],
  });

  // ================= Status & Email Validation =================
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // ================= Expiry Calculator =================
  const calculateExpiry = (startDate: string, duration: string) => {
    if (!startDate) return "";
    const date = new Date(startDate);
    const years = parseInt(duration);
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString().split("T")[0];
  };

  // ================= Add Service =================
  const addService = (type: string) => {
    setServices((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          name: "",
          duration: "1",
          amount: 0,
          startDate: "",
          expiryDate: "",
        },
      ],
    }));
  };

  // ================= Update Service =================
  const updateService = (
    type: string,
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...services[type]];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "startDate" || field === "duration") {
      updated[index].expiryDate = calculateExpiry(
        field === "startDate" ? value : updated[index].startDate,
        field === "duration" ? value : updated[index].duration
      );
    }

    setServices((prev) => ({
      ...prev,
      [type]: updated,
    }));
  };

  // ================= Remove Service =================
  const removeService = (type: string, index: number) => {
    const updated = services[type].filter((_, i) => i !== index);
    setServices((prev) => ({
      ...prev,
      [type]: updated,
    }));
  };

  // ================= Total Calculation =================
  const totalAmount = Object.values(services)
    .flat()
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // ================= Check Email (Inline Validation) =================
  const checkEmail = async (email: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        "http://localhost:5000/api/clients/check-email",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmailExists(response.data.exists); // expects { exists: true/false }
    } catch (err) {
      console.error("Error checking email:", err);
      setEmailExists(false);
    }
  };

  // ================= Add Client =================
  const handleAddClient = async () => {
    setMessage("");
    setError(false);

    try {
      if (!company.companyName) {
        setMessage("Company Name is required!");
        setError(true);
        return;
      }

      if (emailExists) {
        setMessage("Email already exists. Please use a different email.");
        setError(true);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You are not logged in. Please login again.");
        setError(true);
        return;
      }

      // ====== Sanitize services ======
      const sanitizedServices = Object.fromEntries(
        Object.entries(services).map(([type, items]) => [
          type,
          items
            .filter((item) => item.name && item.expiryDate && item.amount > 0)
            .map((item) => ({
              name: item.name,
              amount: Number(item.amount),
              expiryDate: item.expiryDate,
            })),
        ])
      );

      const newClient = { ...company, services: sanitizedServices };

      await axios.post("http://localhost:5000/api/clients", newClient, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Client added successfully ✅");
      setError(false);

      // Reset form
      setCompany({
        companyName: "",
        contactPerson: "",
        email: "",
        mobile: "",
        address: "",
      });
      setServices({ hosting: [], domain: [], ssl: [], amc: [] });

      setEmailExists(false);

      // Optional: redirect after 1-2s
      setTimeout(() => {
        navigate("/client-list");
      }, 2500);
    } catch (err: any) {
      console.error("FULL ERROR:", err);
      if (err.response && err.response.status === 400) {
        setMessage(err.response.data.message || "Client already exists ⚠️");
      } else {
        setMessage("Server error. Please try again later ❌");
      }
      setError(true);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-semibold mb-12 text-gray-800 dark:text-white">
          Client Onboarding
        </h2>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 mb-8 rounded-lg border ${
              error
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-green-50 text-green-600 border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Company Details */}
        <div className="mb-14">
          <h3 className="text-xl font-semibold mb-8">Company Details</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <input
              placeholder="Company Name"
              value={company.companyName}
              onChange={(e) =>
                setCompany({ ...company, companyName: e.target.value })
              }
              className="border rounded-lg px-4 py-2.5"
            />
            <input
              placeholder="Contact Person"
              value={company.contactPerson}
              onChange={(e) =>
                setCompany({ ...company, contactPerson: e.target.value })
              }
              className="border rounded-lg px-4 py-2.5"
            />
            <div className="relative">
              <input
                placeholder="Email"
                value={company.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setCompany({ ...company, email: value });
                  if (value.includes("@")) checkEmail(value);
                }}
                className="border rounded-lg px-4 py-2.5 w-full"
              />
              {emailExists && (
                <p className="text-red-500 text-sm mt-1">
                  This email is already used. Please enter a different email.
                </p>
              )}
            </div>
            <input
              placeholder="Mobile"
              value={company.mobile}
              onChange={(e) =>
                setCompany({ ...company, mobile: e.target.value })
              }
              className="border rounded-lg px-4 py-2.5"
            />
          </div>
          <textarea
            placeholder="Company Address"
            value={company.address}
            onChange={(e) =>
              setCompany({ ...company, address: e.target.value })
            }
            className="border rounded-lg px-4 py-2.5 w-full mt-6"
          />
        </div>

        {/* Services */}
        <div className="mb-14">
          <h3 className="text-xl font-semibold mb-10">Services</h3>
          {Object.keys(services).map((type) => (
            <div key={type} className="mb-12">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-lg font-semibold capitalize">{type}</h4>
                <button
                  onClick={() => addService(type)}
                  className="bg-brand-500 text-white px-4 py-1.5 rounded-lg"
                >
                  + Add {type}
                </button>
              </div>
              {services[type].map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-6 mb-6 grid md:grid-cols-6 gap-4 items-end"
                >
                  <input
                    placeholder="Name / Plan"
                    value={item.name}
                    onChange={(e) =>
                      updateService(type, index, "name", e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                  <select
                    value={item.duration}
                    onChange={(e) =>
                      updateService(type, index, "duration", e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                  </select>
                  <input
                    type="date"
                    value={item.startDate}
                    onChange={(e) =>
                      updateService(type, index, "startDate", e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="date"
                    value={item.expiryDate}
                    readOnly
                    className="border rounded-lg px-3 py-2 bg-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) =>
                      updateService(type, index, "amount", Number(e.target.value))
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() => removeService(type, index)}
                    className="text-red-500 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {services[type].length === 0 && (
                <p className="text-gray-400 text-sm">No {type} added yet.</p>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mb-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl flex justify-between items-center">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-brand-600">
              ₹ {totalAmount}
            </span>
          </div>
        </div>

        {/* Add Button */}
        <div className="text-right">
          <button
            onClick={handleAddClient}
            disabled={emailExists}
            className={`px-8 py-3 rounded-lg text-white ${
              emailExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            Add Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClient;