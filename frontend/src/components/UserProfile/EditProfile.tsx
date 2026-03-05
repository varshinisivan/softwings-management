import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "Admin",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      role: "Admin",
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedUser));

    alert("Profile Updated Successfully");

    window.location.reload();
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      <div className="mb-4">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </div>
  );
};

export default EditProfile;