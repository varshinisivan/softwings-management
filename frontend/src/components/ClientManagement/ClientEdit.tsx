import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { getClientById, updateClient } from "../../api/clientapi";

// ==================== TYPES ====================
interface Service {
  name: string;
  startDate: string;
  expiryDate: string;
  duration: string;
  durationType: "year" | "month";
  amount: string;
  type: "hosting" | "domain" | "ssl" | "amc";
}

interface ClientData {
  _id: string;
  companyName: string;
  email: string;
  mobile: string;
  contactPerson: string;
  address: string;
  services: {
    hosting: Service[];
    domain: Service[];
    ssl: Service[];
    amc: Service[];
  };
  totalAmount: number;
}

// ==================== MAIN COMPONENT ====================
const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ==================== DATE HELPERS ====================
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const calculateExpiryDate = (startDate: string, duration: string, type: "year" | "month") => {
    if (!startDate || !duration) return "";
    try {
      const date = new Date(startDate);
      if (isNaN(date.getTime())) return "";
      
      if (type === "year") {
        date.setFullYear(date.getFullYear() + Number(duration));
      } else {
        date.setMonth(date.getMonth() + Number(duration));
      }
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // ==================== FETCH CLIENT ====================
  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    if (!id) {
      navigate("/clients");
      return;
    }

    try {
      const client = await getClientById(id);
      console.log("Client edit data:", client);

      // Format date for input
      const formatDate = (date: any) => {
        if (!date) return "";
        try {
          return new Date(date).toISOString().split("T")[0];
        } catch {
          return "";
        }
      };

      // Group services by type
      const groupedServices: ClientData['services'] = {
        hosting: [],
        domain: [],
        ssl: [],
        amc: []
      };

      (client.services || []).forEach((service: any) => {
        const type = service.serviceType as keyof ClientData['services'];
        if (groupedServices[type]) {
          groupedServices[type].push({
            name: service.planName || "",
            startDate: formatDate(service.startDate),
            expiryDate: formatDate(service.endDate),
            duration: service.durationMonths?.toString() || service.durationYears?.toString() || "1",
            durationType: service.durationYears ? "year" : "month",
            amount: service.amount?.toString() || "0",
            type: type,
          });
        }
      });

      setClientData({ 
        _id: client._id,
        companyName: client.companyName || "",
        email: client.email || "",
        mobile: client.mobile || "",
        contactPerson: client.contactPerson || "",
        address: client.address || "",
        services: groupedServices,
        totalAmount: client.totalAmount || 0,
      });
      
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching client:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        alert("Client not found");
        navigate("/clients");
      }
    }
  };

  // ==================== COMPANY INFO HANDLERS ====================
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!clientData) return;
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ==================== SERVICE HANDLERS ====================
  const addService = (serviceType: keyof ClientData["services"]) => {
    if (!clientData) return;
    
    const today = getTodayDate();
    
    const newService: Service = {
      name: "",
      startDate: today,
      expiryDate: calculateExpiryDate(today, "1", "year"),
      duration: "1",
      durationType: "year",
      amount: "0",
      type: serviceType,
    };

    setClientData({
      ...clientData,
      services: {
        ...clientData.services,
        [serviceType]: [...clientData.services[serviceType], newService],
      },
    });
  };

  const updateService = (
    serviceType: keyof ClientData["services"],
    index: number,
    field: keyof Service,
    value: string
  ) => {
    if (!clientData) return;
    
    const updatedServices = [...clientData.services[serviceType]];
    updatedServices[index] = { ...updatedServices[index], [field]: value };

    // Auto-calculate expiry date
    if (field === "startDate" || field === "duration" || field === "durationType") {
      const service = updatedServices[index];
      if (service.startDate && service.duration) {
        service.expiryDate = calculateExpiryDate(
          service.startDate,
          service.duration,
          service.durationType
        );
      }
    }

    setClientData({
      ...clientData,
      services: {
        ...clientData.services,
        [serviceType]: updatedServices,
      },
    });
  };

  const removeService = (serviceType: keyof ClientData["services"], index: number) => {
    if (!clientData) return;
    
    setClientData({
      ...clientData,
      services: {
        ...clientData.services,
        [serviceType]: clientData.services[serviceType].filter((_, i) => i !== index),
      },
    });
  };

  // ==================== CALCULATE TOTAL ====================
  const calculateTotal = () => {
    if (!clientData) return 0;
    
    const allServices = [
      ...clientData.services.hosting,
      ...clientData.services.domain,
      ...clientData.services.ssl,
      ...clientData.services.amc,
    ];
    
    return allServices.reduce((sum, service) => sum + Number(service.amount || 0), 0);
  };

  // ==================== VALIDATION ====================
  const validateForm = () => {
    if (!clientData) return false;
    
    const newErrors: { [key: string]: string } = {};

    if (!clientData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!clientData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!clientData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== SAVE CHANGES ====================
  const handleSave = async () => {
    if (!clientData) return;
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    try {
      // Convert grouped services back to array format for backend
      const servicesArray: any[] = [];
      (Object.keys(clientData.services) as Array<keyof ClientData['services']>).forEach(type => {
        clientData.services[type].forEach((service: Service) => {
          servicesArray.push({
            serviceType: type,
            planName: service.name,
            startDate: service.startDate,
            endDate: service.expiryDate,
            durationMonths: service.durationType === "month" ? parseInt(service.duration) : 0,
            durationYears: service.durationType === "year" ? parseInt(service.duration) : 0,
            amount: parseFloat(service.amount),
          });
        });
      });
      
      const dataToSend = {
        companyName: clientData.companyName,
        email: clientData.email,
        mobile: clientData.mobile,
        contactPerson: clientData.contactPerson || "",
        address: clientData.address || "",
        services: servicesArray,
      };
      
      console.log("Sending data:", dataToSend);

      await updateClient(clientData._id, dataToSend);
      
      alert("✅ Client updated successfully!");
      navigate(`/clients/view/${id}`);
      
    } catch (err: any) {
      console.error("Save error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        alert(`❌ Failed to update client: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  // ==================== RENDER SERVICE EDIT TABLE ====================
  const renderServiceEditTable = (title: string, serviceType: keyof ClientData["services"], color: string) => {
    if (!clientData) return null;
    
    const services = clientData.services[serviceType] || [];

    return (
      <div className="mb-8">
        <h3 className={`text-md font-semibold mb-3 ${color}`}>{title}</h3>
        
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => addService(serviceType)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <FaPlus size={12} /> Add {title}
          </button>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic border rounded">
            No {title} added. Click "Add {title}" to add.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border border-gray-200 text-left text-xs font-medium text-gray-600 uppercase">S.No</th>
                  <th className="px-3 py-2 border border-gray-200 text-left text-xs font-medium text-gray-600 uppercase">Plan Name</th>
                  <th className="px-3 py-2 border border-gray-200 text-left text-xs font-medium text-gray-600 uppercase">Duration</th>
                  <th className="px-3 py-2 border border-gray-200 text-left text-xs font-medium text-gray-600 uppercase">Start Date</th>
                  <th className="px-3 py-2 border border-gray-200 text-left text-xs font-medium text-gray-600 uppercase">Expiry Date</th>
                  <th className="px-3 py-2 border border-gray-200 text-left text-xs font-medium text-gray-600 uppercase">Amount (₹)</th>
                  <th className="px-3 py-2 border border-gray-200 text-center text-xs font-medium text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {services.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 text-sm">{index + 1}</td>
                    <td className="px-3 py-2 border border-gray-200">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(serviceType, index, "name", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Plan name"
                      />
                    </td>
                    <td className="px-3 py-2 border border-gray-200">
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={service.duration}
                          onChange={(e) => updateService(serviceType, index, "duration", e.target.value)}
                          className="w-16 px-2 py-1 border rounded text-sm"
                          min="1"
                        />
                        <select
                          value={service.durationType}
                          onChange={(e) => updateService(serviceType, index, "durationType", e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="year">Year</option>
                          <option value="month">Month</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-2 border border-gray-200">
                      <input
                        type="date"
                        value={service.startDate}
                        onChange={(e) => updateService(serviceType, index, "startDate", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 border border-gray-200">
                      <input
                        type="date"
                        value={service.expiryDate}
                        readOnly
                        className="w-full px-2 py-1 border rounded bg-gray-100 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 border border-gray-200">
                      <input
                        type="number"
                        value={service.amount}
                        onChange={(e) => updateService(serviceType, index, "amount", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min="0"
                        step="100"
                      />
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-center">
                      <button
                        type="button"
                        onClick={() => removeService(serviceType, index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50">
                  <td colSpan={5} className="px-3 py-2 border border-gray-200 text-right text-sm font-semibold">Subtotal:</td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-sm font-bold text-blue-600">
                    ₹{services.reduce((sum, s) => sum + Number(s.amount), 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 border border-gray-200"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Loading edit form...</div>
      </div>
    );
  }
  
  if (!clientData) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">No client data found</div>
        <button onClick={() => navigate("/clients")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Clients
        </button>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Client</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/clients/view/${id}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={() => navigate("/clients")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <h2 className="text-lg font-semibold p-3 border-b bg-gray-50">Company Information</h2>
        <div className="p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium w-1/4">Company Name <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input
                    type="text"
                    name="companyName"
                    value={clientData.companyName}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 py-1 border rounded ${errors.companyName ? 'border-red-500' : ''}`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Email <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 py-1 border rounded ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Mobile <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input
                    type="text"
                    name="mobile"
                    value={clientData.mobile}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 py-1 border rounded ${errors.mobile ? 'border-red-500' : ''}`}
                    placeholder="Enter mobile"
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Contact Person</td>
                <td className="py-2">
                  <input
                    type="text"
                    name="contactPerson"
                    value={clientData.contactPerson}
                    onChange={handleCompanyChange}
                    className="w-full px-3 py-1 border rounded"
                    placeholder="Enter contact person"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Address</td>
                <td className="py-2">
                  <textarea
                    name="address"
                    value={clientData.address}
                    onChange={handleCompanyChange}
                    rows={2}
                    className="w-full px-3 py-1 border rounded"
                    placeholder="Enter address"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Services</h2>
        
        {renderServiceEditTable("HOSTING SERVICES", "hosting", "text-blue-600")}
        {renderServiceEditTable("DOMAIN SERVICES", "domain", "text-green-600")}
        {renderServiceEditTable("SSL SERVICES", "ssl", "text-red-600")}
        {renderServiceEditTable("AMC SERVICES", "amc", "text-purple-600")}
      </div>

      {/* Grand Total and Save */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
        <div>
          <span className="text-gray-600 font-semibold">GRAND TOTAL: </span>
          <span className="text-2xl font-bold text-blue-600">₹{calculateTotal().toLocaleString()}</span>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 bg-green-600 text-white rounded font-medium flex items-center gap-2 hover:bg-green-700 ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaSave /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ClientEdit;