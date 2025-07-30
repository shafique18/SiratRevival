import React from 'react';
import Layout from '../components/layout/Layout';
import QuranVerseCard from '../screens/content/QuranVerseCard';
import HadithCard from '../screens/content/HadithCard';
import NewsFeed from '../screens/content/NewsFeed';
import TeamSection from '../components/utils/TeamSection';
import { useTranslation } from "react-i18next";

export default function MainHome() {
  const { t } = useTranslation();
  return (
    <Layout>
      <main className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 font-sans">
        
        {/* 1. Quran Verse Section */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <QuranVerseCard />
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t("index_quran_verse_title")}
            </h2>
            <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-300">
              {t("index_quran_verse_text")}
            </p>
          </div>
        </section>

        {/* 2. Hadith Section */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t("index_hadith_title")}
            </h2>
            <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-300">
              {t("index_hadith_text")}
            </p>
          </div>
          <HadithCard className="order-1 md:order-2" />
        </section>

        {/* 3. Islamic News */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <NewsFeed />
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t("index_news_title")}
            </h2>
            <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-300">
              {t("index_news_text")}
            </p>
          </div>
        </section>

        {/* 4. About App */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            🕌 {t("index_about_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            {t("index_about_text")}
          </p>
        </section>

        {/* 5. Meet the Team */}
        <TeamSection />

        {/* 6. Donation Call-To-Action */}
        <section className="bg-yellow-100 dark:bg-yellow-900/30 text-gray-900 dark:text-gray-100 rounded-3xl shadow-xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-800 dark:text-yellow-200">
            🤲 {t("index_support_title")}
          </h2>
          <p className="text-gray-900 dark:text-white text-lg max-w-2xl mx-auto leading-relaxed">
            {t("index_support_text")}
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition transform hover:scale-105">
            {t("index_donate_button")}
          </button>
        </section>
      </main>
    </Layout>
  );
}
