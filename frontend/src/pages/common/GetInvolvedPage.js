import React, { useState } from "react";
import axios from "axios";

const roles = [
  { label: "Writer", value: "WRITER" },
  { label: "Reviewer", value: "REVIEWER" },
  { label: "Scholar", value: "SCHOLAR" },
  { label: "Partner", value: "PARTNER" },
  { label: "Tech-Savvy", value: "TECH" },
];

const Section = ({ title, description, onOpen }) => (
  <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{description}</p>
    <button
      onClick={onOpen}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Join as {title}
    </button>
  </div>
);

const GetInvolvedPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!selectedRole || explanation.length < 200) return;
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/users/get-involved", {
        email,
        role: selectedRole,
        message: explanation,
      });
      alert("Request submitted!");
      setOpen(false);
      setExplanation("");
      setSelectedRole("");
    } catch (err) {
      alert("Failed to submit request.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6 p-10">
        <Section
          title="Contributor"
          description="Join us as a Writer, Reviewer, or Scholar."
          onOpen={() => setOpen(true)}
        />
        <Section
          title="Partner"
          description="Collaborate with us as an organization or individual."
          onOpen={() => setOpen(true)}
        />
        <Section
          title="Tech-Savvy"
          description="Use your technical skills to support our mission."
          onOpen={() => setOpen(true)}
        />
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Get Involved Form
            </h3>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
                </label>
                <input
                type="email"
                className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Role
            </label>
            <select
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tell us why you want to get involved (500+ words)
            </label>
            <textarea
              rows={6}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Write your explanation here..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedRole || explanation.length < 500}
              className={`w-full py-2 rounded text-white ${
                loading || !selectedRole || explanation.length < 500
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GetInvolvedPage;
