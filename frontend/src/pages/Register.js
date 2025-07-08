import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

import Step1Personal from "../components/Register/Step1Personal";
import Step2Contact from "../components/Register/Step2Contact";
import Step3Account from "../components/Register/Step3Account";
import Step4Identity from "../components/Register/Step4Identity";
import Step5Preferences from "../components/Register/Step5Preferences";
import Step6Payment from "../components/Register/Step6Payment";
import Step7Review from "../components/Register/Step7Review";

const stepTitles = [
  "Personal Info",
  "Contact Info",
  "Account Setup",
  "Identity Verification",
  "Preferences",
  "Payment Info",
  "Review & Submit",
];

// Define validation schema per step
const validationSchemas = [
  Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    nationality: Yup.string().required("Required"),
    preferredLanguage: Yup.string().required("Required"),
    timeZone: Yup.string().required("Required"),
    ethnicity: Yup.string().required("Required"),
    religion: Yup.string().required("Required"),
  }),
  Yup.object({
    primaryEmail: Yup.string().email("Invalid email").required("Required"),
    mobilePhone: Yup.string().required("Required"),
    streetAddress: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    postalCode: Yup.string().required("Required"),
  }),
  Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().min(6, "Min 6 chars").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    userRole: Yup.string().required("Required"),
  }),
  Yup.object({
    nationalIdNumber: Yup.string().required("Required"),
    passportNumber: Yup.string().required("Required"),
    id_document_path: Yup.string().optional("ID Document is optional"),
    selfie_with_id_path: Yup.string().optional("Selfie with ID is optional"),
    video_verification_path: Yup.string().optional("Video verification is optional"),
  }),
  Yup.object({
    contentPreferences: Yup.string().required("Required"),
    communicationPreferences: Yup.string().required("Required"),
  }),
  Yup.object({
    creditCardInfo: Yup.string().required("Required"),
    paypalHandle: Yup.string().required("Required"),
    bankAccountDetails: Yup.string().required("Required"),
    billingAddress: Yup.string().required("Required"),
  }),
  // For review step, no extra validation needed since it's a summary
  Yup.object({}),
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      nationality: "",
      preferredLanguage: "",
      timeZone: "",
      ethnicity: "",
      religion: "",
      primaryEmail: "",
      mobilePhone: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      username: "",
      password: "",
      confirmPassword: "",
      userRole: "",
      nationalIdNumber: "",
      passportNumber: "",
      id_document_path: null,
      selfie_with_id_path: null,
      video_verification_path: null,
      contentPreferences: "",
      communicationPreferences: "",
      creditCardInfo: "",
      paypalHandle: "",
      bankAccountDetails: "",
      billingAddress: "",
    },
    validationSchema: validationSchemas[step - 1], // Use schema of current step for formik's built-in validation (helps on submit)
    onSubmit: async (values) => {
  try {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Log FormData entries for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Convert form values to plain object, excluding Files (should be none now)
    const jsonPayload = {};
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (!(value instanceof File)) {
        jsonPayload[key] = value;
      }
    });

    // Send JSON to backend (not formData)
    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonPayload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Registration failed");

    toast.success("Registration successful! Check your email.");
    formik.resetForm();
    setStep(1);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsSubmitting(false);
  }
},

  });

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, [step]);

  // Validate only current step fields
  const validateStep = async () => {
    const currentSchema = validationSchemas[step - 1];
    try {
      // Validate only current step values
      await currentSchema.validate(formik.values, { abortEarly: false });
      // Mark only current step fields as touched
      const touchedFields = {};
      Object.keys(currentSchema.fields).forEach((key) => {
        touchedFields[key] = true;
      });
      formik.setTouched({ ...formik.touched, ...touchedFields });
      return true;
    } catch (err) {
      if (err.inner) {
        const touchedFields = {};
        const errors = {};
        err.inner.forEach((validationError) => {
          touchedFields[validationError.path] = true;
          errors[validationError.path] = validationError.message;
        });
        formik.setTouched({ ...formik.touched, ...touchedFields });
        formik.setErrors({ ...formik.errors, ...errors });
      }
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) setStep((prev) => Math.min(prev + 1, 7));
    else toast.error("Please complete all required fields.");
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6" ref={formRef}>
        <h1 className="text-3xl font-bold mb-2 text-center">Register</h1>
        <p className="text-center text-gray-600 mb-4">{stepTitles[step - 1]}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6" encType="multipart/form-data">
          {step === 1 && <Step1Personal formik={formik} />}
          {step === 2 && <Step2Contact formik={formik} />}
          {step === 3 && <Step3Account formik={formik} />}
          {step === 4 && <Step4Identity formik={formik} />}
          {step === 5 && <Step5Preferences formik={formik} />}
          {step === 6 && <Step6Payment formik={formik} />}
          {step === 7 && <Step7Review formik={formik} />}

          <div className="flex justify-between items-center mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 7 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
            {step === 7 && (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
