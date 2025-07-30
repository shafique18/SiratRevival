import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import news1 from "../../static/images/news1.jpg";
import news2 from "../../static/images/news2.jpg";
import { useTranslation } from "react-i18next";

export default function NewsFeed({ className = "" }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:8000/content/islamic-news');
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Invalid format');
        setNews(json);
      } catch (e) {
        setError(e.message);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 dark:text-gray-400">Loading news...</p>;

  if (error)
    return (
      <div className="text-center text-red-500">
        {error}
        <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 underline">
          Retry
        </button>
      </div>
    );

  const slides = [news1, news2];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
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
              alt={`News background ${i + 1}`}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-5 md:p-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          📰 {t("news_card_title")}
        </h2>
        {news.map((article, i) => (
          <motion.div
            key={i}
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-gray-700 dark:text-gray-300">{article.title}</p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              Read more
            </a>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}