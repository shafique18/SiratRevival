// src/pages/Profile.js
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  UserCircle,
  Contact,
  ShieldCheck,
  Settings,
  Mail,
  ChevronDown,
  ChevronUp,
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

const renderField = (label, value) => (
  <div className="grid grid-cols-1 md:grid-cols-3">
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 col-span-1">{label}</p>
    <p className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
      {value ?? "N/A"}
    </p>
  </div>
);

const getInitials = (user) => {
  if (!user) return "U";
  const first = user.first_name?.[0] || "";
  const last = user.last_name?.[0] || "";
  return (first + last).toUpperCase();
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
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300">Loading user info...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {getInitials(user)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.username}</p>
            </div>
          </div>

          {/* Personal Info */}
          <Section icon={UserCircle} title="Personal Information">
            {renderField(t("First Name"), user.first_name)}
            {renderField(t("Middle Name"), user.middle_name)}
            {renderField(t("Last Name"), user.last_name)}
            {renderField(t("D.O.B"), user.date_of_birth)}
            {renderField(t("Gender"), user.gender)}
            {renderField(t("Nationality"), user.nationality)}
            {renderField(t("Place Of Birth"), user.place_of_birth)}
            {renderField(t("Preferred Language"), user.preferred_language)}
            {renderField(t("Language Proficiency"), user.language_proficiency)}
            {renderField(t("Time Zone"), user.time_zone)}
            {renderField(t("Ethnicity"), user.ethnicity)}
            {renderField(t("Marital Status"), user.marital_status)}
            {renderField(t("Religion"), user.religion)}
            {renderField(t("Hobbies"), user.hobbies)}
          </Section>

          {/* Contact Info */}
          <Section icon={Mail} title="Contact Information">
            {renderField("Primary Email", user.primary_email)}
            {renderField("Secondary Email", user.secondary_email)}
            {renderField("Mobile Phone", user.mobile_phone)}
            {renderField("Land Line", user.land_line)}
            {renderField(
              "Address",
              `${user.street_address}, ${user.city}, ${user.state}, ${user.country} - ${user.postal_code}`
            )}
            {renderField("Alternate Contact", user.alternate_contact_info)}
          </Section>

          {/* Account Details */}
          <Section icon={Settings} title="Account Details">
            {renderField("Username", user.username)}
            {renderField("User Role", user.user_role)}
          </Section>

          {/* Verification */}
          <Section icon={ShieldCheck} title="Identity Verification">
            <div className="flex items-center justify-between">
              {renderField("National ID Number", user.national_id_number)}
              <VerifiedBadge isVerified={!!user.national_id_number} />
            </div>
            <div className="flex items-center justify-between">
              {renderField("Passport Number", user.passport_number)}
              <VerifiedBadge isVerified={!!user.passport_number} />
            </div>
            <div className="flex items-center justify-between">
              {renderField("ID Document", user.id_document_path)}
              <VerifiedBadge isVerified={!!user.id_document_path} />
            </div>
            <div className="flex items-center justify-between">
              {renderField("Selfie with ID", user.selfie_with_id_path)}
              <VerifiedBadge isVerified={!!user.selfie_with_id_path} />
            </div>
            <div className="flex items-center justify-between">
              {renderField("Video Verification", user.video_verification_path)}
              <VerifiedBadge isVerified={!!user.video_verification_path} />
            </div>
          </Section>

          {/* Preferences & Payments */}
          <Section icon={Contact} title="Preferences & Payment">
            {renderField("Content Preferences", user.content_preferences)}
            {renderField("Communication Preferences", user.communication_preferences)}
            {renderField("Credit Card Info", user.credit_card_info ? "Provided" : "Not Provided")}
            {renderField("Paypal Handle", user.paypal_handle ? "Provided" : "Not Provided")}
            {renderField("Bank Account Details", user.bank_account_details ? "Provided" : "Not Provided")}
            {renderField("Billing Address", user.billing_address)}
          </Section>

          {/* Logout Button */}
          <LanguageSwitcher />
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
