
import React from "react";
import InputField from "./InputField";

export default function Step2Contact({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Email" name="primaryEmail" type="email" formik={formik} />
      <InputField label="Phone" name="mobilePhone" formik={formik} />
      <InputField label="Street Address" name="streetAddress" formik={formik} />
      <InputField label="City" name="city" formik={formik} />
      <InputField label="State" name="state" formik={formik} />
      <InputField label="Country" name="country" formik={formik} />
      <InputField label="Postal Code" name="postalCode" formik={formik} />
    </div>
  );
}
