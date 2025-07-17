// Step1Personal.js
import React from "react";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import MultiSelectField from "../common/MultiSelectField";
import DatePickerField from "../common/DatePickerField";

import { languages, countries } from "countries-list";
import moment from "moment-timezone";

// Static dropdowns
const genders = ["Male", "Female", "Prefer not to say"];
const ethnicities = ["Asian", "Black", "White", "Hispanic", "Mixed", "Arab", "Indigenous", "Pacific Islander", "Other"];
const marital_status = ["Single", "Married", "Divorced", "Widowed"];
const religions = ["Islam", "Christianity", "Hinduism", "Buddhism", "Sikhism", "Judaism", "Jainism", "Shinto", "Atheism", "Agnostic", "Other"];
const hobbies = [
  { label: "Cycling", value: "Cycling" },
  { label: "Running", value: "Running" },
  { label: "Painting", value: "Painting" },
  { label: "Adventure Sports", value: "Adventure Sports" },
  { label: "Singing", value: "Singing" },
  { label: "Other", value: "Other" },
];

// Countries
const countryList = Object.values(countries).map((country) => country.name);

// Languages
const languageOptions = Object.entries(languages).map(([code, lang]) => ({
  label: lang.name,
  value: lang.name,
}));

// Enhanced time zones with UTC offset
const timeZones = moment.tz.names()
  .map((zone) => {
    const offset = moment.tz(zone).utcOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? "+" : "-";
    const offsetStr = `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    return { label: `${offsetStr} - ${zone}`, value: zone, offset };
  })
  .sort((a, b) => a.offset - b.offset)
  .map((tz) => ({ label: tz.label, value: tz.value }));

export default function Step1Personal({ formik }) {
 
  const handleMultiSelect = (name, values) => {
  const valueArray = values.map((val) => {
    // If value is a string with quotes, parse it
    if (typeof val === "string" && val.startsWith('"')) {
      return JSON.parse(val); // Remove extra quotes
    }
    return typeof val === "string" ? val : val.value;
  });

  formik.setFieldValue(name, JSON.stringify(valueArray));
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="First Name" name="first_name" formik={formik} />
      <InputField label="Middle Name" name="middle_name" formik={formik} />
      <InputField label="Last Name" name="last_name" formik={formik} />
      <DatePickerField label="D.O.B" name="date_of_birth" formik={formik} />

      <SelectField label="Gender" name="gender" options={genders} formik={formik} />
      <SelectField label="Nationality" name="nationality" options={countryList} formik={formik} />
      <SelectField label="Place Of Birth" name="place_of_birth" options={countryList} formik={formik} />
      <SelectField label="Preferred Language" name="preferred_language" options={languageOptions.map((l) => l.label)} formik={formik} />

      <MultiSelectField
        label="Language Proficiency"
        name="language_proficiency"
        options={languageOptions}
        formik={formik}
        onChange={(values) => handleMultiSelect("language_proficiency", values)}
      />

      <SelectField label="Time Zone" name="time_zone" options={timeZones} formik={formik} />
      <SelectField label="Ethnicity" name="ethnicity" options={ethnicities} formik={formik} />
      <SelectField label="Marital Status" name="marital_status" options={marital_status} formik={formik} />
      <SelectField label="Religion" name="religion" options={religions} formik={formik} />

      <MultiSelectField
        label="Hobbies"
        name="hobbies"
        options={hobbies}
        isCreatable
        formik={formik}
        onChange={(values) => handleMultiSelect("hobbies", values)}
      />
    </div>
  );
}
