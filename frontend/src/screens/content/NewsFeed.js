import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import news1 from "../../static/images/news1.jpg";
import news2 from "../../static/images/news2.jpg";
import fallbackImage from "../../static/images/fallback.jpg";
import { useTranslation } from "react-i18next";

export default function NewsFeed({ className = "" }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const paginationRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:8000/content/islamic-news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const json = await res.json();
        setNews(json.slice(0, 30));
      } catch (err) {
        setError("Failed to load news. Please try again.");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">Loading news...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
        <br />
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Utility to trim text but allow CSS line-clamp to handle overflow nicely
  const trimmedText = (text, maxLength = 160) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  // Custom handlers to scroll pagination dots on navigation click
  const handlePrevClick = () => {
    if (!paginationRef.current) return;
    paginationRef.current.scrollBy({ left: -60, behavior: "smooth" });
    swiperRef.current?.slidePrev();
  };
  const handleNextClick = () => {
    if (!paginationRef.current) return;
    paginationRef.current.scrollBy({ left: 60, behavior: "smooth" });
    swiperRef.current?.slideNext();
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Top Banner Swiper */}
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        className="h-56 md:h-72"
      >
        {[news1, news2].map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Header ${idx}`}
              className="w-full h-full object-cover rounded-t-3xl"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Section Title */}
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          📰 {t("news_card_title") || "Latest Islamic News"}
        </h2>

        <div className="relative">
          {/* Swiper showing exactly 2 cards at a time with custom nav */}
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            modules={[Navigation, Pagination]}
            pagination={{
              el: ".custom-pagination",
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className}" aria-label="Go to slide ${
                  index + 1
                }"></span>`;
              },
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            className="news-swiper"
          >
            {news.map((article, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col h-[430px]"
                >
                  <img
                    src={article.image_url || fallbackImage}
                    alt={article.title}
                    className="w-full aspect-[16/9] object-cover rounded-t-xl"
                    loading="lazy"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    {article.author && (
                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-1 truncate">
                        By {article.author}
                      </p>
                    )}
                    {article.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-5">
                        {trimmedText(article.description, 160)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(article.date).toLocaleDateString()} |{" "}
                      {article.source_name}
                    </p>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 underline mt-3 block"
                    >
                      {t("read_more") || "Read more"}
                    </a>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            onClick={handlePrevClick}
            className="custom-prev absolute -bottom-14 left-1/3 z-10 p-2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition"
            aria-label="Previous news"
          >
            ‹
          </button>
          <button
            onClick={handleNextClick}
            className="custom-next absolute -bottom-14 right-1/3 z-10 p-2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition"
            aria-label="Next news"
          >
            ›
          </button>

          {/* Custom pagination container */}
          <div
            ref={paginationRef}
            className="custom-pagination mx-auto mt-4 max-w-[400px] overflow-x-auto no-scrollbar whitespace-nowrap"
            aria-label="News pagination"
          />
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbar but allow horizontal scroll */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Pagination bullets */
        .custom-pagination .swiper-pagination-bullet {
          display: inline-block;
          background: #2563eb;
          opacity: 0.5;
          width: 10px;
          height: 10px;
          margin: 0 6px;
          border-radius: 50%;
          transition: opacity 0.3s ease, transform 0.3s ease;
          cursor: pointer;
        }

        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          background: #1e40af;
          width: 14px;
          height: 14px;
          transform: scale(1.2);
        }

        /* Limit title and description text lines */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.section>
  );
}
