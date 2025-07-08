
import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

const userRoles = ["GROUP_0_5", "GROUP_6_15", "GROUP_16_25", "GROUP_26_PLUS"];

export default function Step3Account({ formik }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Username" name="username" formik={formik} />
      <InputField label="Password" name="password" type="password" formik={formik} />
      <InputField label="Confirm Password" name="confirm_password" type="password" formik={formik} />
      <SelectField label="User Role" name="user_role" options={userRoles} formik={formik} />
    </div>
  );
}
