
import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

const genders = ["Male", "Female", "Other", "Prefer not to say"];
const nationalities = ["American", "Canadian", "British", "Indian", "Australian"];
const languages = ["English", "Spanish", "Arabic", "Hindi", "French"];
const timeZones = ["UTC", "GMT", "EST", "PST", "CET", "IST"];
const ethnicities = ["Asian", "Black", "White", "Hispanic", "Mixed"];
const religions = ["Islam", "Christianity", "Hinduism", "Buddhism", "Atheism"];

export default function Step1Personal({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="First Name" name="firstName" formik={formik} />
      <InputField label="Last Name" name="lastName" formik={formik} />
      <SelectField label="Gender" name="gender" options={genders} formik={formik} />
      <SelectField label="Nationality" name="nationality" options={nationalities} formik={formik} />
      <SelectField label="Preferred Language" name="preferredLanguage" options={languages} formik={formik} />
      <SelectField label="Time Zone" name="timeZone" options={timeZones} formik={formik} />
      <SelectField label="Ethnicity" name="ethnicity" options={ethnicities} formik={formik} />
      <SelectField label="Religion" name="religion" options={religions} formik={formik} />
    </div>
  );
}
