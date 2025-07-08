import React from "react";

export default function Step7Review({ formik }) {
  const { values } = formik;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-h-[400px] overflow-auto text-gray-800">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Review Your Information</h2>

      <Section title="Personal Information">
        <KeyValue label="First Name" value={values.firstName} />
        <KeyValue label="Last Name" value={values.lastName} />
        <KeyValue label="Gender" value={values.gender} />
        <KeyValue label="Nationality" value={values.nationality} />
        <KeyValue label="Preferred Language" value={values.preferredLanguage} />
        <KeyValue label="Time Zone" value={values.timeZone} />
      </Section>

      <Section title="Contact Information">
        <KeyValue label="Primary Email" value={values.primaryEmail} />
        <KeyValue label="Mobile Phone" value={values.mobilePhone} />
        <KeyValue label="Address" value={`${values.streetAddress}, ${values.city}, ${values.state}, ${values.country} - ${values.postalCode}`} />
      </Section>

      <Section title="Account Details">
        <KeyValue label="Username" value={values.username} />
        <KeyValue label="User Role" value={values.userRole} />
      </Section>

      <Section title="Identity Verification">
        <KeyValue label="National ID Number" value={values.nationalIdNumber} />
        <KeyValue label="Passport Number" value={values.passportNumber} />
        <FilePath label="ID Document" value={values.id_document_path} />
        <FilePath label="Selfie with ID" value={values.selfie_with_id_path} />
        <FilePath label="Video Verification" value={values.video_verification_path} />
      </Section>

      <Section title="Preferences & Payment">
        <KeyValue label="Content Preferences" value={values.contentPreferences} />
        <KeyValue label="Communication Preferences" value={values.communicationPreferences} />
        <KeyValue label="Credit Card Info" value={values.creditCardInfo ? "Provided" : "Not Provided"} />
        <KeyValue label="Paypal Handle" value={values.paypalHandle} />
        <KeyValue label="Bank Account Details" value={values.bankAccountDetails} />
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
