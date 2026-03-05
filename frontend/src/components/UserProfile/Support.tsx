import { useState } from "react";

const Support: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Support request submitted");
    setMessage("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Support</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 max-w-xl"
      >
        <label className="block mb-2 font-medium">
          Describe your issue
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default Support;