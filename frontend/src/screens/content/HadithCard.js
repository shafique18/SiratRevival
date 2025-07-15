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
    async function load() {
      try {
        const res = await fetch('http://localhost:8000/content/hadith-today');
        if (!res.ok) throw new Error('Failed to load hadith');
        setHadith(await res.json());
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, []);

  if (error) return (
    <div className="text-center text-red-500">
      {error}
      <button onClick={() => window.location.reload()} className="mt-2 block text-blue-600 underline">
        Retry
      </button>
    </div>
  );
    if (!hadith) {
      return (
        <div className="flex justify-center items-center h-56">
          <span className="animate-pulse text-gray-400">Loading hadith...</span>
        </div>
      );
   }


  const slides = [hadith1, hadith2];

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 ${className}`}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop
        modules={[Autoplay]}
        autoplay={{ delay: 6000 }}
        className="h-56 md:h-72"
      >
        {slides.map((src,i) => (
          <SwiperSlide key={i}>
            <img src={src} className="object-cover w-full h-full rounded-t-3xl" alt="Hadith"/>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-6 text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-800 dark:text-gray-100">
          📜 Hadith of the Day
        </h2>
        <motion.p className="italic text-gray-700 dark:text-gray-300 mb-4">
          "{hadith.text}"
        </motion.p>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          – {hadith.source}
        </p>
      </div>
    </motion.section>
  );
}
