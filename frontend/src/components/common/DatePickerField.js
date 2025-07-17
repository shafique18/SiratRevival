// DatePickerField.js
import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

export default function DatePickerField({ label, name, formik }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={formik.values[name] ? dayjs(formik.values[name]) : null}
        onChange={(date) => formik.setFieldValue(name, date ? date.toISOString() : null)}
        onBlur={() => formik.setFieldTouched(name, true)}
        maxDate={dayjs()} // can't pick future dates
        slotProps={{
          textField: {
            fullWidth: true,
            error: formik.touched[name] && Boolean(formik.errors[name]),
            helperText: formik.touched[name] && formik.errors[name],
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
}
