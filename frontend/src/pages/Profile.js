// src/pages/Profile.js
import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

import {
  UserCircle,
  Contact,
  ShieldCheck,
  Settings,
  Mail,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
} from "lucide-react";

const Section = ({ icon: Icon, title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-900">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Icon className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>
        {open ? (
          <ChevronUp className="text-gray-500" />
        ) : (
          <ChevronDown className="text-gray-500" />
        )}
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
};

const VerifiedBadge = ({ isVerified }) => (
  <span
    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
      isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
    }`}
  >
    {isVerified ? "Verified" : "Not Verified"}
  </span>
);

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth
          ? user.date_of_birth.split("T")[0]
          : "",
        gender: user.gender || "",
        nationality: user.nationality || "",
        place_of_birth: user.place_of_birth || "",
        preferred_language: user.preferred_language || "",
        language_proficiency: user.language_proficiency || "",
        time_zone: user.time_zone || "",
        ethnicity: user.ethnicity || "",
        marital_status: user.marital_status || "",
        religion: user.religion || "",
        hobbies: user.hobbies || "",
        primary_email: user.primary_email || "",
        secondary_email: user.secondary_email || "",
        mobile_phone: user.mobile_phone || "",
        landline_number: user.landline_number || "",
        street_address: user.street_address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postal_code: user.postal_code || "",
        alternate_contact_info: user.alternate_contact_info || "",
        username: user.username || "",
        user_role: user.user_role || "",
        content_preferences: user.content_preferences || "",
        communication_preferences: user.communication_preferences || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300">Loading user info...</p>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleEditToggle = () => {
    if (editing) {
      // On cancel, reset formData to user
      setFormData({
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth
          ? user.date_of_birth.split("T")[0]
          : "",
        gender: user.gender || "",
        nationality: user.nationality || "",
        place_of_birth: user.place_of_birth || "",
        preferred_language: user.preferred_language || "",
        language_proficiency: user.language_proficiency || "",
        time_zone: user.time_zone || "",
        ethnicity: user.ethnicity || "",
        marital_status: user.marital_status || "",
        religion: user.religion || "",
        hobbies: user.hobbies || "",
        primary_email: user.primary_email || "",
        secondary_email: user.secondary_email || "",
        mobile_phone: user.mobile_phone || "",
        landline_number: user.landline_number || "",
        street_address: user.street_address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postal_code: user.postal_code || "",
        alternate_contact_info: user.alternate_contact_info || "",
        username: user.username || "",
        user_role: user.user_role || "",
        content_preferences: user.content_preferences || "",
        communication_preferences: user.communication_preferences || "",
      });
    }
    setEditing((e) => !e);
  };

  function cleanFormData(data) {
    const cleaned = {};
    for (const key in data) {
      if (typeof data[key] === "string" && data[key].trim() === "") {
        cleaned[key] = null; // convert empty strings to null
      } else {
        cleaned[key] = data[key];
      }
    }
    return cleaned;
  }

  const saveProfile = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("authTokens"));
      const token = tokens?.access_token || "";
      const cleanedFormData = cleanFormData(formData);
      const res = await fetch("http://localhost:8000/users/profile-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ This is required
        },
        body: JSON.stringify(cleanedFormData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("Error details: " + JSON.stringify(errorData));
        throw new Error("Failed to update profile");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  const renderField = (label, name, type = "text") => (
    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-1"
      >
        {label}
      </label>
      <div className="sm:col-span-3">
        {editing ? (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        ) : (
          <p className="text-sm text-gray-900 dark:text-gray-100">{formData[name] || "N/A"}</p>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
       <Toaster position="top-right" />
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-10 space-y-8">
            
            {/* Avatar & Name Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-semibold shadow-lg">
                  {(user.first_name?.[0] || "") + (user.last_name?.[0] || "")}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{user.username}</p>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                aria-pressed={editing}
              >
                {editing ? (
                  <>
                    <X size={18} /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={18} /> Edit Profile
                  </>
                )}
              </button>
            </div>

          {/* Sections */}
          <div className="space-y-6">
          <Section icon={UserCircle} title={t("Personal Information")}>
            {renderField(t("First Name"), "first_name")}
            {renderField(t("Middle Name"), "middle_name")}
            {renderField(t("Last Name"), "last_name")}
            {renderField(t("Date of Birth"), "date_of_birth", "date")}
            {renderField(t("Gender"), "gender")}
            {renderField(t("Nationality"), "nationality")}
            {renderField(t("Place Of Birth"), "place_of_birth")}
            {renderField(t("Preferred Language"), "preferred_language")}
            {renderField(t("Language Proficiency"), "language_proficiency")}
            {renderField(t("Time Zone"), "time_zone")}
            {renderField(t("Ethnicity"), "ethnicity")}
            {renderField(t("Marital Status"), "marital_status")}
            {renderField(t("Religion"), "religion")}
            {renderField(t("Hobbies"), "hobbies")}
          </Section>
          

          <Section icon={Mail} title={t("Contact Information")}>
            {renderField(t("Primary Email"), "primary_email", "email")}
            {renderField(t("Secondary Email"), "secondary_email", "email")}
            {renderField(t("Mobile Phone"), "mobile_phone")}
            {renderField(t("Land Line"), "landline_number")}
            {renderField(t("Street Address"), "street_address")}
            {renderField(t("City"), "city")}
            {renderField(t("State"), "state")}
            {renderField(t("Country"), "country")}
            {renderField(t("Postal Code"), "postal_code")}
            {renderField(t("Alternate Contact"), "alternate_contact_info")}
          </Section>

          <Section icon={Settings} title={t("Account Details")}>
            {renderField(t("Username"), "username")}
            {renderField(t("User Role"), "user_role")}
          </Section>

          <Section icon={ShieldCheck} title={t("Identity Verification")}>
            {[
              { label: "National ID Number", value: user.national_id_number },
              { label: "Passport Number", value: user.passport_number },
              { label: "Social Security Number", value: user.social_security_number },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{value || "N/A"}</p>
                  <VerifiedBadge isVerified={Boolean(value)} />
                </div>
              </div>
            ))}
          </Section>

          <Section icon={Settings} title={t("Preferences")}>
            {renderField(t("Content Preferences"), "content_preferences")}
            {renderField(t("Communication Preferences"), "communication_preferences")}
          </Section>
          </div>

          {/* Save Button */}
          {editing && (
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={saveProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-md flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}

          {/* Logout */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow"
            >
              {t("Logout")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
