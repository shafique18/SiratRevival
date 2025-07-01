import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsFeed() {
  const [news, setNews] = useState([])

  useEffect(() => {
    fetch('/api/content/islamic-news')
      .then(res => res.json())
      .then(setNews)
  }, [])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
      className="bg-white shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4">🌍 Islamic World News</h2>
      {news.map((article, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: { opacity: 1, x: 0 }
          }}
          className="border-b last:border-none pb-2 mb-2"
        >
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-700 hover:underline"
          >
            {article.title}
          </a>
          <p className="text-sm text-gray-600">
            {article.source} | {new Date(article.date).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
