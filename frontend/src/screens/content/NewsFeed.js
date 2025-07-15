import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import news1 from "../../static/images/news1.jpg";
import news2 from "../../static/images/news2.jpg";

export default function NewsFeed({ className = "" }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  if (error) return (
    <div className="text-center text-red-500">
      {error}
      <button onClick={() => window.location.reload()} className="mt-2 block text-blue-600 underline">
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
        autoplay={{ delay: 7000 }}
        className="h-56 md:h-72"
      >
        {slides.map((src,i) => (
          <SwiperSlide key={i}>
            <img src={src} className="object-cover w-full h-full rounded-t-3xl" alt="news"/>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-6">
        <h2 className="text-3xl font-extrabold mb-4 text-gray-800 dark:text-gray-100 text-center">
          🌍 Islamic World News
        </h2>

        {news.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium">No news available.</p>
        ) : (
          news.map((art,i) => (
            <motion.article
              key={i}
              variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
              className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 last:mb-0 last:border-none"
            >
              <a href={art.link} target="_blank" rel="noopener noreferrer"
                 className="text-lg font-semibold text-blue-700 dark:text-blue-300 hover:underline">
                {art.title}
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {art.source} | {new Date(art.date).toLocaleDateString()}
              </p>
            </motion.article>
          ))
        )}
      </div>
    </motion.section>
  );
}
