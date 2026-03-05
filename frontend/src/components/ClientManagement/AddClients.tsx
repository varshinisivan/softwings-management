import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type ServiceType = "hosting" | "domain" | "ssl" | "amc";

interface ServiceItem {
  serviceType: ServiceType;
  planName: string;
  durationMonths: number;
  durationYears: number;
  startDate: string;
  endDate: string;
  amount: number;
  manualEndDate: boolean;
}

interface ClientForm {
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  address: string;
}

const AddClient: React.FC = () => {
  const navigate = useNavigate();

  const [clientData, setClientData] = useState<ClientForm>({
    companyName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [services, setServices] = useState<ServiceItem[]>([]);

  // ================= Add Service =================
  const addService = (type: ServiceType) => {
    setServices((prev) => [
      ...prev,
      {
        serviceType: type,
        planName: "",
        durationMonths: 0,
        durationYears: 0,
        startDate: "",
        endDate: "",
        amount: 0,
        manualEndDate: false,
      },
    ]);
  };

  // ================= Remove Service =================
  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= Date Calculation =================
  const calculateEndDate = (
    startDate: string,
    months: number,
    years: number
  ) => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString().split("T")[0];
  };

  // ================= Handle Service Change =================
  const handleServiceChange = (
    index: number,
    field: keyof ServiceItem,
    value: any
  ) => {
    const updated = [...services];
    updated[index][field] = value;

    const service = updated[index];

    if (
      !service.manualEndDate &&
      (field === "durationMonths" ||
        field === "durationYears" ||
        field === "startDate")
    ) {
      service.endDate = calculateEndDate(
        service.startDate,
        Number(service.durationMonths),
        Number(service.durationYears)
      );
    }

    if (field === "endDate") {
      service.manualEndDate = true;
    }

    setServices(updated);
  };

  // ================= Validation =================
  const validateForm = () => {
    if (!clientData.companyName || !clientData.email) {
      alert("Company Name and Email are required");
      return false;
    }

    if (services.length === 0) {
      alert("Please add at least one service");
      return false;
    }

    return true;
  };

  // ================= Submit =================
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/api/clients", {
        ...clientData,
        services,
      });

      alert("Client Added Successfully ✅");
      navigate("/all-clients");
    } catch (error) {
      console.error(error);
      alert("Error adding client");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* ================= Header ================= */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Client Onboarding
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Add client details and service subscriptions
          </p>
        </div>

        {/* ================= Company Details ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Company Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.keys(clientData).map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.replace(/([A-Z])/g, " $1")}
                className="input-style"
                value={clientData[key as keyof ClientForm]}
                onChange={(e) =>
                  setClientData({
                    ...clientData,
                    [key]: e.target.value,
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* ================= Services ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Services</h3>

          <div className="flex flex-wrap gap-3 mb-6">
            {(["hosting", "domain", "ssl", "amc"] as ServiceType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => addService(type)}
                  className="btn-primary"
                >
                  + Add {type.toUpperCase()}
                </button>
              )
            )}
          </div>

          {services.map((service, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 mb-6 bg-gray-50"
            >
              <div className="flex justify-between mb-4">
                <h4 className="font-semibold capitalize">
                  {service.serviceType} Service
                </h4>
                <button
                  onClick={() => removeService(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <input
                  placeholder="Plan Name"
                  className="input-style"
                  value={service.planName}
                  onChange={(e) =>
                    handleServiceChange(index, "planName", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Amount"
                  className="input-style"
                  value={service.amount}
                  onChange={(e) =>
                    handleServiceChange(index, "amount", e.target.value)
                  }
                />

                <input
                  type="date"
                  className="input-style"
                  value={service.startDate}
                  onChange={(e) =>
                    handleServiceChange(index, "startDate", e.target.value)
                  }
                />

                <select
                  className="input-style"
                  value={service.durationMonths}
                  onChange={(e) =>
                    handleServiceChange(
                      index,
                      "durationMonths",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={0}>Months</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} Month
                    </option>
                  ))}
                </select>

                <select
                  className="input-style"
                  value={service.durationYears}
                  onChange={(e) =>
                    handleServiceChange(
                      index,
                      "durationYears",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={0}>Years</option>
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} Year
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  className="input-style"
                  value={service.endDate}
                  onChange={(e) =>
                    handleServiceChange(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate("/all-clients")}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button onClick={handleSubmit} className="btn-primary">
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Styling */}
      <style>{`
        .input-style {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: 0.2s;
        }
        .input-style:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
          outline: none;
        }
        .btn-primary {
          padding: 10px 20px;
          background: #4f46e5;
          color: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
        }
        .btn-secondary {
          padding: 10px 20px;
          background: #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default AddClient;