import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import quran1 from "../../static/images/quran1.jpg";
import quran2 from "../../static/images/quran2.jpeg";
import { useTranslation } from "react-i18next";

export default function QuranVerseCard({ className = "" }) {
  const [verse, setVerse] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const cachedVerse = sessionStorage.getItem('quranVerse');
    if (cachedVerse) {
      setVerse(JSON.parse(cachedVerse));
    } else {
      async function loadVerse() {
        try {
          const res = await fetch('http://localhost:8000/content/quran-today');
          if (!res.ok) throw new Error('Failed to load verse');
          const data = await res.json();
          sessionStorage.setItem('quranVerse', JSON.stringify(data));
          setVerse(data);
        } catch (e) {
          setError(e.message);
        }
      }
      loadVerse();
    }
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <button
          onClick={() => {
            sessionStorage.removeItem('quranVerse');
            window.location.reload();
          }}
          className="mt-2 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="flex justify-center items-center h-56">
        <span className="animate-pulse text-gray-400">Fetching verse...</span>
      </div>
    );
  }

  const slides = [quran1, quran2];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 ${className}`}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        className="h-56 md:h-72"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              className="object-cover w-full h-full rounded-t-3xl"
              alt={`Quran background ${i + 1}`}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-6 text-center">
        <h2 className="text-2xl font-extrabold mb-2 text-gray-800 dark:text-gray-100">
          📖 {t("qura_card_title")}
        </h2>
        <motion.p className="text-xl italic text-gray-700 dark:text-gray-300 mb-4">
          {verse.arabic}
        </motion.p>
        <motion.p className="italic text-gray-800 dark:text-gray-200 text-lg mb-2">
          "{verse.translation}"
        </motion.p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          – {verse.surah} ({verse.ayah})
        </p>
      </div>
    </motion.section>
  );
}