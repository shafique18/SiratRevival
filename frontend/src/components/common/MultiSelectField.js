import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function MultiSelectField({
  label,
  name,
  options,
  formik,
  isCreatable = false,
}) {
  const SelectComponent = isCreatable ? CreatableSelect : Select;

  const handleChange = (selected) => {
    const values = selected ? selected.map((opt) => opt.value) : [];
    formik.setFieldValue(name, values);
  };

  const selectedValues = options.filter((opt) =>
    (formik.values[name] || []).includes(opt.value)
  );

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <SelectComponent
        isMulti
        name={name}
        options={options}
        value={selectedValues}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(name, true)}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "var(--tw-bg-opacity, white)",
            borderColor: "gray",
          }),
        }}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );
}
