import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import feedback from "../../static/images/feedback.jpg";
import suggestion from "../../static/images/suggestion.png";
import reports from "../../static/images/reports.jpg";

const InputField = ({ type = "text", name, placeholder, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    onChange={onChange}
    required
  />
);

const FormSection = ({ id, title, description, endpoint, illustration }) => {
  const initialForm = { name: "", email: "", message: "" };
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(endpoint, formData);
      toast.success("Thank you! Your message has been submitted.");
      setFormData(initialForm);
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
            <InputField name="name" placeholder="Your Name" onChange={handleChange} value={formData.name} />
            <InputField type="email" name="email" placeholder="Your Email" onChange={handleChange} value={formData.email} />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              value={formData.message}
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </motion.div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </section>
  );
};

const GeneralSection = () => (
  <section
    id="general"
    className="w-full py-20 px-6 md:px-20 bg-white dark:bg-gray-900 text-center"
  >
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        We'd love to hear from you! Reach out for any inquiries, feedback, or support.
      </p>
      <div className="mt-8 space-y-4 text-gray-800 dark:text-gray-200 text-left">
        <p><strong>Email:</strong> contact@siratrevival.org</p>
        <p><strong>Phone:</strong> +1 (123) 456-7890</p>
        <p><strong>Address:</strong> 123 Sirat Lane, Revival City, World</p>
      </div>
    </motion.div>
  </section>
);

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
