
import React from "react";

export default function SelectField({ label, name, options, formik }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        <option value="">Select {label}</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );
}
