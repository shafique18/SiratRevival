
import React from "react";
import InputField from "./InputField";

export default function Step5Preferences({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Preferred Content" name="contentPreferences" formik={formik} />
      <InputField label="Communication Preferences" name="communicationPreferences" formik={formik} />
    </div>
  );
}
