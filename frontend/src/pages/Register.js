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

// Validation schemas remain unchanged...

const validationSchemas = [
  Yup.object({
    first_name: Yup.string().required("Required"),
    middle_name: Yup.string().optional("Required"),
    last_name: Yup.string().required("Required"),
    date_of_birth: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    preferred_pronouns: Yup.string().optional("Required"),
    nationality: Yup.string().required("Required"),
    place_of_birth: Yup.string().required("Required"),
    preferred_language: Yup.string().required("Required"),
    time_zone: Yup.string().required("Required"),
    ethnicity: Yup.string().required("Required"),
    marital_status: Yup.string().required("Required"),
    religion: Yup.string().required("Required"),
    hobbies: Yup.string().optional("Optional"),
    language_proficiency: Yup.string().optional("Optional"),
  }),
  Yup.object({
    primary_email: Yup.string().email("Invalid email").required("Required"),
    secondary_email: Yup.string().email("Invalid email").optional("Optional"),
    mobile_phone: Yup.string().required("Required"),
    landline_number: Yup.string().optional("Optional"),
    street_address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    postal_code: Yup.string().required("Required"),
    alternate_contact_info: Yup.string().optional("Optional"),
  }),
  Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().min(6, "Min 6 chars").required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    user_role: Yup.string().required("Required"),
  }),
  Yup.object({
    national_id_number: Yup.string().required("Required"),
    passport_number: Yup.string().required("Required"),
    id_document_path: Yup.string().optional("ID Document is optional"),
    selfie_with_id_path: Yup.string().optional("Selfie with ID is optional"),
    video_verification_path: Yup.string().optional("Video verification is optional"),
  }),
  Yup.object({
    content_preferences: Yup.string().required("Required"),
    communication_preferences: Yup.string().required("Required"),
  }),
  Yup.object({
    credit_card_info: Yup.string().required("Required"),
    paypal_handle: Yup.string().required("Required"),
    bank_account_details: Yup.string().required("Required"),
    billing_address: Yup.string().required("Required"),
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
      // unchanged
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      preferred_pronouns: "",
      nationality: "",
      place_of_birth: "",
      preferred_language: "",
      time_zone: "",
      ethnicity: "",
      marital_status: "",
      religion: "",
      hobbies: "",
      language_proficiency: "",
      primary_email: "",
      secondary_email: "",
      mobile_phone: "",
      landline_number: "",
      street_address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      username: "",
      password: "",
      confirm_password: "",
      user_role: "",
      national_id_number: "",
      passport_number: "",
      id_document_path: null,
      selfie_with_id_path: null,
      video_verification_path: null,
      content_preferences: "",
      communication_preferences: "",
      credit_card_info: "",
      paypal_handle: "",
      bank_account_details: "",
      billing_address: "",
    },
    validationSchema: validationSchemas[step - 1],
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

        // Convert values to JSON payload for backend
        const jsonPayload = {};
        Object.keys(values).forEach((key) => {
          const value = values[key];
          if (!(value instanceof File)) {
            jsonPayload[key] = value;
          }
        });
        Object.keys(jsonPayload).forEach((key) => {
          if (typeof jsonPayload[key] === "string") {
            jsonPayload[key] = jsonPayload[key].replace(/\\/g, "/");
          }
        });
        if (!jsonPayload.email && jsonPayload.primary_email) {
          jsonPayload.email = jsonPayload.primary_email;
        }

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

  // Validate current step fields only
  const validateStep = async () => {
    const currentSchema = validationSchemas[step - 1];
    try {
      await currentSchema.validate(formik.values, { abortEarly: false });
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
        err.inner.forEach(({ path, message }) => {
          touchedFields[path] = true;
          errors[path] = message;
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
      <div
        className="max-w-5xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md
                   flex flex-col md:flex-row gap-8"
        ref={formRef}
      >
        {/* Form container */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left text-gray-900 dark:text-white">
            Register
          </h1>
          <p className="text-center md:text-left text-gray-600 dark:text-gray-300 mb-6">
            {stepTitles[step - 1]}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            ></div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
            noValidate
          >
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
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Back
                </button>
              )}
              {step < 7 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Next
                </button>
              )}
              {step === 7 && (
                <button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
              {/* Right side space for future message/image */}
        <aside className="hidden md:block md:w-80 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 shadow-inner text-gray-700 dark:text-gray-300">
          {/* Example placeholder content */}
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p>
            Register to access personalized features and stay updated with our
            latest news and offers.
          </p>
          {/* You can replace this with an image or other content */}
        </aside>
        
      </div>
    </Layout>
  );
}
