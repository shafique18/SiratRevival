
import React from "react";
import InputField from "../common/InputField";

export default function Step5Preferences({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Preferred Content" name="content_preferences" formik={formik} />
      <InputField label="Communication Preferences" name="communication_preferences" formik={formik} />
    </div>
  );
}
