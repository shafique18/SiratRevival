import { useEffect, useState, lazy, Suspense } from "react";
import Layout from "../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import fallbackImage from "../../static/images/fallback.jpg";

const Modal = lazy(() => import("../../components/common/NewsModal"));

const NewsCard = ({ article, onReadMore, onToggleBookmark, isBookmarked }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col relative">
      <img
        src={article.image_url || fallbackImage}
        alt={article.title}
        className="w-full aspect-[16/9] object-cover"
        loading="lazy"
      />
      <div className="absolute top-3 right-3 z-10">
        <button onClick={() => onToggleBookmark(article)} aria-label="Toggle bookmark">
          {isBookmarked ? (
            <BookmarkCheck className="w-6 h-6 text-yellow-400" />
          ) : (
            <Bookmark className="w-6 h-6 text-white hover:text-yellow-300" />
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-5">
          {article.description}
        </p>
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span>{article.source_name}</span>
        </div>
        <button
          onClick={() => onReadMore(article)}
          className="mt-4 self-start text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          aria-label={`Read more about ${article.title}`}
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default function GlobalIslamicNews() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalArticle, setModalArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedArticles");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Persist bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarkedArticles", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:8000/content/islamic-news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const json = await res.json();
        setNews(json.slice(0, 100));
        setFilteredNews(json.slice(0, 100));
      } catch (err) {
        setError("Failed to load news. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const sourceList = showBookmarks ? bookmarks : news;
    const filtered = sourceList.filter((article) =>
      article.title.toLowerCase().includes(query) ||
      article.description?.toLowerCase().includes(query) ||
      article.content?.toLowerCase().includes(query)
    );
    setFilteredNews(filtered);
  };

  const handleToggleBookmark = (article) => {
    const exists = bookmarks.some((a) => a.link === article.link);
    if (exists) {
      const updated = bookmarks.filter((a) => a.link !== article.link);
      setBookmarks(updated);
      if (showBookmarks) {
        setFilteredNews((prev) => prev.filter((a) => a.link !== article.link));
      }
    } else {
      const updated = [...bookmarks, article];
      setBookmarks(updated);
    }
  };

  const handleTabToggle = () => {
    setShowBookmarks((prev) => !prev);
    const sourceList = !showBookmarks ? bookmarks : news;
    const filtered = sourceList.filter((article) =>
      article.title.toLowerCase().includes(searchQuery) ||
      article.description?.toLowerCase().includes(searchQuery) ||
      article.content?.toLowerCase().includes(searchQuery)
    );
    setFilteredNews(filtered);
  };

  const getTitle = () => {
    return showBookmarks ? "Bookmarked Articles" : "Global Islamic News";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white my-8 text-center">
          {getTitle()}
        </h1>

        <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleTabToggle}
            className={`px-4 py-2 rounded-md font-semibold border transition-all ${
              showBookmarks
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            }`}
          >
            {showBookmarks ? "Back to News" : "Bookmarked"}
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading news...</p>
        )}

        {error && (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {showBookmarks
              ? "No bookmarked news for this session."
              : "No articles found."}
          </p>
        )}

        {!loading && !error && filteredNews.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((article, i) => (
              <NewsCard
                key={i}
                article={article}
                onReadMore={(art) => setModalArticle(art)}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={bookmarks.some((a) => a.link === article.link)}
              />
            ))}
          </div>
        )}

        <AnimatePresence>
          {modalArticle && (
            <Suspense fallback={<div className="text-center text-gray-500 mt-8">Loading article...</div>}>
              <Modal article={modalArticle} onClose={() => setModalArticle(null)} />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
