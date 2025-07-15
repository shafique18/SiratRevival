import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function HadithCard() {
  const [hadith, setHadith] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHadith = async () => {
      try {
        const res = await fetch('http://localhost:8000/content/hadith-today')
        if (!res.ok) throw new Error("Failed to load hadith")
        const data = await res.json()
        setHadith(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchHadith()
  }, [])

  if (error) return <p className="text-red-500">{error}</p>
  if (!hadith) return <p>Loading hadith...</p>

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-green-50 dark:bg-gray-800 shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        📜 Hadith of the Day
      </h2>
      <motion.p className="text-gray-800 dark:text-gray-300 italic mb-2">
        "{hadith.text}"
      </motion.p>
      <p className="text-sm text-gray-500 dark:text-gray-400">– {hadith.source}</p>
    </motion.div>
  )
}
