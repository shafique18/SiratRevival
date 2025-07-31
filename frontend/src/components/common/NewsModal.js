import { motion } from "framer-motion";
import { useState } from "react";

const NewsModal = ({ article, onClose }) => {
  if (!article) return null;

  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
    // Ideally store this in localStorage or backend
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: article.link,
        });
      } else {
        navigator.clipboard.writeText(article.link);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      alert("Could not share the article.");
    }
  };

  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
        >
          &times;
        </button>

        <h2 id="modal-title" className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {article.title}
        </h2>

        <img
          src={article.image_url || "/static/images/fallback.jpg"}
          alt={article.title}
          className="w-full max-h-64 object-cover rounded-md mb-4"
          loading="lazy"
        />

        <p id="modal-content" className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
          {article.content || article.description || "No additional content available."}
        </p>

        <div className="mt-6 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span>{article.source_name}</span>
        </div>

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 underline"
        >
          Open full article in new tab
        </a>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleBookmark}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Share
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewsModal;
