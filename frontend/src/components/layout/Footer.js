import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      console.log("Hi");
      const res = await fetch('http://localhost:8000/content/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      console.log(res);

      const data = await res.json();
      if (res.ok) {
        setMessage('Subscribed successfully!');
        setEmail('');
      } else {
        setMessage(data?.error || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Server error. Try again later.');
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="w-full px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">SiratRevival</h3>
          <p className="text-sm text-gray-400">
            A platform to revive Islamic knowledge through Quran, Hadith, and modern-day awareness.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">{t("Quick Links")}</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/" className="hover:text-green-400"> {t("Home")} </a></li>
            <li><a href="/quran" className="hover:text-green-400"> {t("Quran") }</a></li>
            <li><a href="/hadith" className="hover:text-green-400"> {t("Hadith")}</a></li>
            <li><a href="/news" className="hover:text-green-400">{t("News")}</a></li>
            <li><a href="/contact" className="hover:text-green-400">{t("Contact us")}</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get daily Islamic wisdom and updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-black rounded-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>
          {message && (
            <p className="mt-2 text-sm text-green-400">{message}</p>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400 text-center md:text-left">
          © 2025 SiratRevival. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0 text-xl">
          <a href="#" aria-label="Facebook" className="hover:text-green-400">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-green-400">
            <FaTwitter />
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-green-400">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}
