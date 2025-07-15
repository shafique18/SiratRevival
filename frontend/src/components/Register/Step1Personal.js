
import React from "react";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

const genders = ["Male", "Female", "Prefer not to say"];
const nationalities = ["American", "Canadian", "British", "Indian", "Australian"];
const languages = ["English", "Spanish", "Arabic", "Hindi", "French"];
const timeZones = ["UTC", "GMT", "EST", "PST", "CET", "IST"];
const ethnicities = ["Asian", "Black", "White", "Hispanic", "Mixed"];
const marital_status = ["Single", "Married", "Divorced", "Widowed"];
const religions = ["Islam", "Christianity", "Hinduism", "Buddhism", "Atheism"];
const language_proficiency = ["English", "Spanish", "Arabic", "Hindi", "French"];
const hobbies = ["Cycling", "Running", "Painting", "Adventure Sports", "Singing", "Other"];


export default function Step1Personal({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="First Name" name="first_name" formik={formik} />
      <InputField label="Middle Name" name="middle_name" formik={formik} />
      <InputField label="Last Name" name="last_name" formik={formik} /><div></div>
      <InputField label="D.O.B" name="date_of_birth" formik={formik} />
      <SelectField label="Gender" name="gender" options={genders} formik={formik} />
      <SelectField label="Nationality" name="nationality" options={nationalities} formik={formik} />
      <SelectField label="Place Of Birth" name="place_of_birth" options={nationalities} formik={formik} />
      <SelectField label="Preferred Language" name="preferred_language" options={languages} formik={formik} />
      <SelectField label="Language Proficiency" name="language_proficiency" options={language_proficiency} formik={formik} />
      <SelectField label="Time Zone" name="time_zone" options={timeZones} formik={formik} />
      <SelectField label="Ethnicity" name="ethnicity" options={ethnicities} formik={formik} />
      <SelectField label="Marital Status" name="marital_status" options={marital_status} formik={formik} />
      <SelectField label="Religion" name="religion" options={religions} formik={formik} />
      <SelectField label="Hobbies" name="hobbies" options={hobbies} formik={formik} />
    </div>
  );
}
