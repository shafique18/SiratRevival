import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import { FaUserEdit, FaHandshake, FaLaptopCode } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import firstVideo from "../../static/videos/first.mp4";

const sections = [
  {
    id: "contributor",
    label: "Contributor",
    // Roles for dropdown selection
    roles: [
      { label: "Writer", value: "WRITER" },
      { label: "Reviewer", value: "REVIEWER" },
      { label: "Scholar", value: "SCHOLAR" },
    ],
    icon: <FaUserEdit className="text-blue-600 text-4xl" />,
    description:
      "Contribute your knowledge and skills by writing, reviewing, or sharing Islamic scholarly insights.",
  },
  {
    id: "partner",
    label: "Partner",
    roles: [{ label: "Partner", value: "PARTNER" }],
    icon: <FaHandshake className="text-green-600 text-4xl" />,
    description:
      "Collaborate with us to strengthen the community and expand the reach of Islamic knowledge.",
  },
  {
    id: "tech-savvy",
    label: "Tech-Savvy",
    roles: [{ label: "Tech-Savvy", value: "TECH" }],
    icon: <FaLaptopCode className="text-purple-600 text-4xl" />,
    description:
      "Help build tools, platforms, and technology to make Islamic learning more accessible.",
  },
];

const navbarHeight = 70; // Adjust based on your navbar height

const RoleCard = ({ section, onOpen }) => {
  // For Contributor, show only one button, others keep buttons for each role
  if (section.id === "contributor") {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-8 rounded-3xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition cursor-pointer flex flex-col items-center text-center"
      >
        <div className="mb-4">{section.icon}</div>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {section.label}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
          {section.description}
        </p>
        <button
          onClick={() => onOpen(section)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          type="button"
        >
          Join as Contributor
        </button>
      </motion.div>
    );
  }

  // For other sections, render role cards for each role (as before)
  return section.roles.map((role) => (
    <motion.div
      key={role.value}
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700 transition flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {role.label}
        </h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Become a {role.label.toLowerCase()} and contribute your skills.
        </p>
      </div>
      <button
        onClick={() => onOpen({ ...role, section })}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mt-auto"
        type="button"
      >
        Join as {role.label}
      </button>
    </motion.div>
  ));
};

const GetInvolvedPage = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null); // for contributor or partner, tech
  const [selectedRole, setSelectedRole] = useState(null); // role selected in modal dropdown or single
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Scroll to hash if present on page load or when location changes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  // Navigation handler to smooth scroll to section
  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.history.pushState(null, "", `#${id}`); // update url hash without reload
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const openModal = (sectionOrRole) => {
    if (sectionOrRole.id === "contributor") {
      // Contributor clicked, open modal with roles dropdown
      setSelectedSection(sectionOrRole);
      setSelectedRole(null);
    } else {
      // Partner or Tech clicked - direct role selected
      setSelectedSection(sectionOrRole.section || sectionOrRole);
      setSelectedRole(sectionOrRole);
    }
    setExplanation("");
    setEmail("");
    setOpen(true);
  };

const handleSubmit = async () => {
  if (!email || !selectedRole || explanation.trim().split(/\s+/).length < 500) {
    if (!email) {
      toast.error("Please enter your email.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
    } else if (!selectedRole) {
      toast.error("Please select a role.");
    } else if (explanation.trim().split(/\s+/).length < 500) {
      toast.error("Explanation must be at least 500 words.");
    }
    return;
  }

  setLoading(true);

  try {
    await axios.post("http://localhost:8000/users/get-involved", {
      email,
      role: selectedRole.value,
      message: explanation,
    });

    toast.success("🎉 Your request has been submitted successfully!");
    setOpen(false);
    setEmail("");
    setExplanation("");
    setSelectedRole(null);
    setSelectedSection(null);
  } catch (err) {
    console.error(err);
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.detail ||
      (status === 500
        ? "Server error. Please try again later."
        : "Something went wrong. Please check your input and try again.");
    toast.error(msg);
  }

  setLoading(false);
};

  // Detailed explanations for roles (you can expand this)
  const contributorRoleDescriptions = {
    WRITER:
      "As a Writer, you will create well-researched and authentic content to spread Islamic knowledge effectively.",
    REVIEWER:
      "As a Reviewer, you will ensure the accuracy and quality of the content by providing critical feedback and edits.",
    SCHOLAR:
      "As a Scholar, you will contribute scholarly insights and help maintain the authenticity of the knowledge shared.",
  };

  return (
    <Layout>
      <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0"
          autoPlay
          loop
          muted
          playsInline
          src={firstVideo}
        />

        <div className="relative z-10 px-6 py-24 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 dark:text-white mb-6 drop-shadow-md">
            Get Involved
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            Join our mission to spread authentic Islamic knowledge. Choose how you
            want to contribute and help build a brighter future.
          </p>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {sections.map((section) => (
              <RoleCard
                key={section.id}
                section={section}
                onOpen={openModal}
              />
            ))}
          </div>
        </div>

        {/* Modal */}
      <AnimatePresence>
  {open && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpen(false)} // close on outside click
    >
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-3xl max-w-xl w-full shadow-2xl relative overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Join as{" "}
          {selectedSection?.id === "contributor"
            ? "Contributor"
            : selectedRole?.label || ""}
        </h3>

        {selectedSection?.id === "contributor" && (
          <>
            <label
              htmlFor="roleSelect"
              className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Select your role
            </label>
            <select
              id="roleSelect"
              className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-6"
              value={selectedRole?.value || ""}
              onChange={(e) => {
                const val = e.target.value;
                const role = selectedSection.roles.find(
                  (r) => r.value === val
                );
                setSelectedRole(role);
              }}
            >
              <option value="" disabled>
                -- Choose a role --
              </option>
              {selectedSection.roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            {selectedRole && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-900 dark:text-blue-300 overflow-auto">
                <strong>Role Description:</strong>{" "}
                {contributorRoleDescriptions[selectedRole.value]}
              </div>
            )}
          </>
        )}

        {selectedSection?.id !== "contributor" && selectedRole && (
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            {selectedSection.description}
          </p>
        )}

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Why do you want to get involved? (Minimum 500 words)
        </label>
        <textarea
          rows={6}
          placeholder="Explain why you want to join (min. 500 words)"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        ></textarea>
        <div className="text-sm mb-6 text-gray-600 dark:text-gray-400 text-right">
          Word Count:{" "}
          <strong>{explanation.trim() ? explanation.trim().split(/\s+/).length : 0}</strong>{" "}
          / 500
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:hover:text-white text-2xl font-bold"
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </Layout>
  );
};

export default GetInvolvedPage;
