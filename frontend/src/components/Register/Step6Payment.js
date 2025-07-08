
import React from "react";
import InputField from "./InputField";

export default function Step6Payment({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Credit Card Info" name="creditCardInfo" formik={formik} />
      <InputField label="PayPal Handle" name="paypalHandle" formik={formik} />
      <InputField label="Bank Account" name="bankAccountDetails" formik={formik} />
      <InputField label="Billing Address" name="billingAddress" formik={formik} />
    </div>
  );
}
