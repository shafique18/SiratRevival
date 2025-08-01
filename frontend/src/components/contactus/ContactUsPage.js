import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import feedback from "../../static/svg/feedback.svg";
import suggestion from "../../static/svg/suggestions.svg";
import reports from "../../static/svg/report.svg";

const InputField = ({ type = "text", name, placeholder, onChange, value, error }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      className={`w-full px-4 py-3 rounded-xl border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
      onChange={onChange}
      required
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FormSection = ({ id, title, description, endpoint, illustration }) => {
  const initialForm = { name: "", email: "", message: "" };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // optional

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.message.trim()) errors.message = "Message cannot be empty";
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      // Add recaptchaToken to payload if you integrate it
      await axios.post(endpoint, { ...formData, recaptchaToken });
      toast.success("Thank you! Your message has been submitted.");
      setFormData(initialForm);
      setFormErrors({});
    } catch (err) {
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      className="w-full py-24 px-6 md:px-20 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2"
        >
          <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">{description}</p>
          <img
            src={illustration}
            alt={`${title} illustration`}
            className="mt-6 rounded-xl shadow-xl w-full max-w-sm mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 w-full"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl space-y-6"
          >
            <InputField
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              value={formData.name}
              error={formErrors.name}
            />
            <InputField
              type="email"
              name="email"
              placeholder="Your Email"
              onChange={handleChange}
              value={formData.email}
              error={formErrors.email}
            />
            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border ${
                  formErrors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                onChange={handleChange}
                value={formData.message}
                required
              />
              {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </motion.div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </section>
  );
};

const GeneralSection = () => {
  return (
    <section
      id="general"
      className="relative w-full py-24 px-6 md:px-20 bg-white dark:bg-gray-900 overflow-hidden"
    >
      {/* Modern organic blobs with soft gradients & animations */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="blobGradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blobGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blobGradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Blob 1 */}
        <motion.path
          fill="url(#blobGradient1)"
          initial={{ scale: 1, translateX: 0, translateY: 0 }}
          animate={{
            scale: [1, 1.05, 1],
            translateX: [0, 10, 0],
            translateY: [0, -10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          d="M170 60c35-20 90-10 110 40s-10 110-45 130-90 0-110-40 10-110 45-130z"
          opacity="0.7"
        />

        {/* Blob 2 */}
        <motion.path
          fill="url(#blobGradient2)"
          initial={{ scale: 1, translateX: 0, translateY: 0 }}
          animate={{
            scale: [1, 1.1, 1],
            translateX: [0, -15, 0],
            translateY: [0, 10, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          d="M620 280c40-15 85 5 95 50s-20 95-60 110-85-5-95-50 20-95 60-110z"
          opacity="0.6"
        />

        {/* Blob 3 */}
        <motion.path
          fill="url(#blobGradient3)"
          initial={{ scale: 1, translateX: 0, translateY: 0 }}
          animate={{
            scale: [1, 0.95, 1],
            translateX: [0, 12, 0],
            translateY: [0, 8, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          d="M390 50c50 10 80 40 70 85s-60 70-110 60-80-40-70-85 60-70 110-60z"
          opacity="0.5"
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-20"
      >
        {/* Left side: Heading and description */}
        <div className="lg:w-1/2 text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md">
            We'd love to hear from you! Reach out for any inquiries, feedback, or support.
          </p>
        </div>

        {/* Right side: Contact details */}
        <div className="lg:w-1/2 text-gray-800 dark:text-gray-200 max-w-md">
          <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
          <div className="space-y-5 text-left">
            <div>
              <p className="font-medium mb-1">Email</p>
              <a
                href="mailto:contact@siratrevival.org"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                contact@siratrevival.org
              </a>
            </div>
            <div>
              <p className="font-medium mb-1">Phone</p>
              <a
                href="tel:+11234567890"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                +1 (123) 456-7890
              </a>
            </div>
            <div>
              <p className="font-medium mb-1">Address</p>
              <address className="not-italic leading-relaxed">
                123 Sirat Lane,
                <br />
                Revival City, World
              </address>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 dark:border-gray-600">
      <button
        className="w-full text-left py-4 px-2 text-xl font-medium flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>
        <span className="text-2xl">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="px-2 pb-4 text-gray-700 dark:text-gray-300">{answer}</p>}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How can I submit feedback?",
      answer: "Scroll to the Feedback section above and use the form provided.",
    },
    {
      question: "Where is your team based?",
      answer: "Our team works remotely from various locations around the world.",
    },
    {
      question: "How can I report a bug or issue?",
      answer: "Use the Report section to describe the issue and submit the form.",
    },
    {
      question: "Will my suggestions be reviewed?",
      answer: "Yes, every suggestion is read and considered by our team.",
    },
  ];

  return (
    <section
      id="faqs"
      className="w-full py-20 px-6 md:px-20 bg-gray-50 dark:bg-gray-800 max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} {...faq} />
        ))}
      </div>
    </section>
  );
};

export default function ContactUsPage() {
  const location = useLocation();
  const navbarHeight = 70;

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <Layout>
      <GeneralSection />
      <FormSection
        id="feedback"
        title="Feedback"
        description="We appreciate your feedback! Let us know your thoughts and experiences."
        endpoint="http://localhost:8000/users/feedback"
        illustration={feedback}
      />
      <FormSection
        id="suggestion"
        title="Suggestions"
        description="Have ideas for improvement? We'd love to hear them."
        endpoint="http://localhost:8000/users/suggestion"
        illustration={suggestion}
      />
      <FormSection
        id="report"
        title="Report"
        description="Found a bug or an issue? Report it so we can resolve it quickly."
        endpoint="http://localhost:8000/users/report"
        illustration={reports}
      />
      <FAQSection />
    </Layout>
  );
}
