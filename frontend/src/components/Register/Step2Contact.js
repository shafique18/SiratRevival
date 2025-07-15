
import React from "react";
import InputField from "../common/InputField";

export default function Step2Contact({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Email" name="primary_email" type="email" formik={formik} />
      <InputField label="Secondary Email" name="secondary_email" type="email" formik={formik} />
      <InputField label="Phone" name="mobile_phone" formik={formik} />
      <InputField label="Land Line" name="landline_number" formik={formik} />
      <InputField label="Street Address" name="street_address" formik={formik} />
      <InputField label="City" name="city" formik={formik} />
      <InputField label="State" name="state" formik={formik} />
      <InputField label="Country" name="country" formik={formik} />
      <InputField label="Postal Code" name="postal_code" formik={formik} />
      <InputField label="Alternate Contact" name="alternate_contact_info" formik={formik} />
      
    </div>
  );
}
