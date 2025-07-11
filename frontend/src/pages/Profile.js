// src/pages/Profile.js
import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
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
      {open && <div className="mt-4 space-y-2">{children}</div>}
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
  const { user, logout, setUser } = useContext(AuthContext); // assume setUser available
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "", // YYYY-MM-DD format
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
    setEditing((e) => !e);
    if (!editing) {
      // reset to user data on cancel
      setFormData({
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "",
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
  };

function cleanFormData(data) {
  const cleaned = {};
  for (const key in data) {
    if (typeof data[key] === "string" && data[key].trim() === "") {
      cleaned[key] = null;  // convert empty strings to null
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
    // const cleanedFormData = cleanFormData(formData);
    console.log(JSON.stringify(formData));
    const res = await fetch("http://localhost:8000/users/profile-update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ This is required
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error details:", errorData);
      throw new Error("Failed to update profile");
    }

    const updatedUser = await res.json();
    setUser(updatedUser);
    setEditing(false);
    alert("Profile updated successfully");
  } catch (error) {
    alert("Error updating profile: " + error.message);
  }
};

  const renderField = (label, name, type = "text") => (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 col-span-1">{label}</p>
      <div className="col-span-2">
        {editing ? (
          <input
            type={type}
            name={name}
            value={formData[name] || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-sm text-gray-900 dark:text-gray-100">{formData[name] || "N/A"}</p>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {(user.first_name?.[0] || "") + (user.last_name?.[0] || "")}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.username}</p>
            </div>
            <button
              onClick={handleEditToggle}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              {editing ? (
                <>
                  <X size={16} /> Cancel
                </>
              ) : (
                <>
                  <Edit2 size={16} /> Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Personal Info */}
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

          {/* Contact Info */}
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

          {/* Account Details */}
          <Section icon={Settings} title={t("Account Details")}>
            {renderField(t("Username"), "username")}
            {renderField(t("User Role"), "user_role")}
          </Section>

          {/* Verification - display only, no edit */}
          <Section icon={ShieldCheck} title={t("Identity Verification")}>
            <div className="flex items-center justify-between">
              <p>National ID Number:</p>
              <p>{user.national_id_number || "N/A"}</p>
              <VerifiedBadge isVerified={!!user.national_id_number} />
            </div>
            <div className="flex items-center justify-between">
              <p>Passport Number:</p>
              <p>{user.passport_number || "N/A"}</p>
              <VerifiedBadge isVerified={!!user.passport_number} />
            </div>
            <div className="flex items-center justify-between">
              <p>ID Document:</p>
              <p>{user.id_document_path || "N/A"}</p>
              <VerifiedBadge isVerified={!!user.id_document_path} />
            </div>
            <div className="flex items-center justify-between">
              <p>Selfie with ID:</p>
              <p>{user.selfie_with_id_path || "N/A"}</p>
              <VerifiedBadge isVerified={!!user.selfie_with_id_path} />
            </div>
            <div className="flex items-center justify-between">
              <p>Video Verification:</p>
              <p>{user.video_verification_path || "N/A"}</p>
              <VerifiedBadge isVerified={!!user.video_verification_path} />
            </div>
          </Section>

           {/* Preferences & Payments */}
          <Section icon={Contact} title="Preferences">
            {renderField(t("Content Preferences"), "content_preferences")}
            {renderField(t("Communication Preferences"), "communication_preferences")}
          </Section>

          {editing && (
            <div className="flex gap-4 justify-end">
              <button
                onClick={saveProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                <Save size={16} className="inline mr-1" /> Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
