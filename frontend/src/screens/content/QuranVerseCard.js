import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function QuranVerseCard() {
  const [verse, setVerse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const res = await fetch('http://localhost:8000/content/quran-today')
        if (!res.ok) throw new Error("Failed to load verse")
        const data = await res.json()
        setVerse(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchVerse()
  }, [])

  if (error) return <p className="text-red-500">{error}</p>
  if (!verse) return <p>Loading verse...</p>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        📖 Verse of the Day
      </h2>
      <motion.p className="text-right text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {verse.arabic}
      </motion.p>
      <motion.p className="text-gray-800 dark:text-gray-300 italic">
        "{verse.translation}"
      </motion.p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        – {verse.surah} ({verse.ayah})
      </p>
    </motion.div>
  )
}
