import React from "react";

export default function Step7Review({ formik }) {
  const { values } = formik;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-h-[400px] overflow-auto text-gray-800">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Review Your Information</h2>

      <Section title="Personal Information">
        <KeyValue label="First Name" value={values.first_name} />
        <KeyValue label="Middle Name" value={values.middle_name} />
        <KeyValue label="Last Name" value={values.last_name} />
        <KeyValue label="D.O.B" value={values.date_of_birth} />
        <KeyValue label="Gender" value={values.gender} />
        <KeyValue label="Nationality" value={values.nationality} />
        <KeyValue label="Place Of Birth" value={values.place_of_birth} />
        <KeyValue label="Preferred Language" value={values.preferred_language} />
        <KeyValue label="Language Proficiency" value={values.language_proficiency} />
        <KeyValue label="Time Zone" value={values.time_zone} />
        <KeyValue label="Ethnicity" value={values.ethnicity} />
        <KeyValue label="Marital Status" value={values.marital_status} />
        <KeyValue label="Religion" value={values.religion} />
        <KeyValue label="Hobbies" value={values.hobbies} />
      </Section>

      <Section title="Contact Information">
        <KeyValue label="Primary Email" value={values.primary_email} />
        <KeyValue label="Secondary Email" value={values.secondary_email} />
        <KeyValue label="Mobile Phone" value={values.mobile_phone} />
        <KeyValue label="Land Line" value={values.landline_number} />
        <KeyValue label="Address" value={`${values.street_address}, ${values.city}, ${values.state}, ${values.country} - ${values.postal_code}`} />
        <KeyValue label="Alternate Contact" value={values.alternate_contact_info} />
      </Section>

      <Section title="Account Details">
        <KeyValue label="Username" value={values.username} />
        <KeyValue label="User Role" value={values.user_role} />
      </Section>

      <Section title="Identity Verification">
        <KeyValue label="National ID Number" value={values.national_id_number} />
        <KeyValue label="Passport Number" value={values.passport_number} />
        <FilePath label="ID Document" value={values.id_document_path} />
        <FilePath label="Selfie with ID" value={values.selfie_with_id_path} />
        <FilePath label="Video Verification" value={values.video_verification_path} />
      </Section>

      <Section title="Preferences & Payment">
        <KeyValue label="Content Preferences" value={values.content_preferences} />
        <KeyValue label="Communication Preferences" value={values.communication_preferences} />
        <KeyValue label="Credit Card Info" value={values.credit_card_info ? "Provided" : "Not Provided"} />
        <KeyValue label="Paypal Handle" value={values.paypal_handle} />
        <KeyValue label="Bank Account Details" value={values.bank_account_details} />
        <KeyValue label="Billing Address" value={values.billing_address} />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h3 className="text-lg font-medium mb-2 text-gray-700">{title}</h3>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function KeyValue({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-200 py-1">
      <span className="font-semibold text-gray-600">{label}:</span>
      <span className="text-gray-800 break-words max-w-[60%] text-right">{value}</span>
    </div>
  );
}

function FilePath({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-200 py-1">
      <span className="font-semibold text-gray-600">{label}:</span>
      <a
        href={`http://localhost:8000/${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline max-w-[60%] truncate text-right"
      >
        View File
      </a>
    </div>
  );
}
