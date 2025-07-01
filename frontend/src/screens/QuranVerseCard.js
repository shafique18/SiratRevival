import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function QuranVerseCard() {
  const [verse, setVerse] = useState(null)

  useEffect(() => {
    fetch('/content/quran-today')
      .then(res => res.json())
      .then(setVerse)
  }, [])

  if (!verse) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-2">📖 Verse of the Day</h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-right text-lg font-semibold text-gray-700 mb-2"
      >
        {verse.arabic}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-gray-800 italic"
      >
        "{verse.translation}"
      </motion.p>
      <p className="text-sm text-gray-500 mt-1">
        – {verse.surah} ({verse.ayah})
      </p>
    </motion.div>
  )
}
