import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import hadith1 from "../../static/images/hadith1.jpeg";
import hadith2 from "../../static/images/hadith2.jpg";

export default function HadithCard({ className = "" }) {
  const [hadith, setHadith] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedHadith = sessionStorage.getItem("hadithOfTheDay");
    if (cachedHadith) {
      setHadith(JSON.parse(cachedHadith));
    } else {
      async function fetchHadith() {
        try {
          const res = await fetch('http://localhost:8000/content/hadith-today');
          if (!res.ok) throw new Error('Failed to load hadith');
          const data = await res.json();
          sessionStorage.setItem("hadithOfTheDay", JSON.stringify(data));
          setHadith(data);
        } catch (e) {
          setError(e.message);
        }
      }
      fetchHadith();
    }
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <button
          onClick={() => {
            sessionStorage.removeItem("hadithOfTheDay");
            window.location.reload();
          }}
          className="mt-2 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hadith) {
    return (
      <div className="flex justify-center items-center h-56">
        <span className="animate-pulse text-gray-400 dark:text-gray-500">Loading hadith...</span>
      </div>
    );
  }

  const slides = [hadith1, hadith2];

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 ${className}`}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop
        modules={[Autoplay]}
        autoplay={{ delay: 7000 }}
        className="h-56 sm:h-64 md:h-72"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Hadith background ${i + 1}`}
              className="w-full h-full object-cover rounded-t-3xl"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-5 md:p-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          📜 Hadith of the Day
        </h2>
        <motion.p
          className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-3"
        >
          "{hadith.text}"
        </motion.p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          – {hadith.source}
        </p>
      </div>
    </motion.section>
  );
}