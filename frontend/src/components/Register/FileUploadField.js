
import React from "react";

export default function FileUploadField({ label, name, formik, accept }) {
  const handleChange = (e) => {
    formik.setFieldValue(name, e.currentTarget.files[0]);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-semibold text-gray-700">
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        onChange={handleChange}
        accept={accept}
        className="border rounded p-2"
      />
    </div>
  );
}
