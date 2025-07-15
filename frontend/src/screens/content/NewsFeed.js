import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsFeed() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/content/islamic-news', {
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(async res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid data')
        setNews(data)
      })
      .catch(err => {
        console.error('News fetch error:', err)
        setNews([]) // fallback to empty array
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center">Loading news...</p>

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
      className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        🌍 Islamic World News
      </h2>

      {news.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No news available.</p>
      ) : (
        news.map((article, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="border-b dark:border-gray-700 last:border-none pb-2 mb-2"
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {article.source} | {new Date(article.date).toLocaleDateString()}
            </p>
          </motion.div>
        ))
      )}
    </motion.div>
  )
}
