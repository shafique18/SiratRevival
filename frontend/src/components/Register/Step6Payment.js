
import React from "react";
import InputField from "./InputField";

export default function Step6Payment({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Credit Card Info" name="credit_card_info" formik={formik} />
      <InputField label="PayPal Handle" name="paypal_handle" formik={formik} />
      <InputField label="Bank Account" name="bank_account_details" formik={formik} />
      <InputField label="Billing Address" name="billing_address" formik={formik} />
    </div>
  );
}
