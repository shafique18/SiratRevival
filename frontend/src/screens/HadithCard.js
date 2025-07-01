import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function HadithCard() {
  const [hadith, setHadith] = useState(null)

  useEffect(() => {
    fetch('/api/content/hadith-today')
      .then(res => res.json())
      .then(setHadith)
  }, [])

  if (!hadith) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-green-50 shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-2">📜 Hadith of the Day</h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-800 italic mb-2"
      >
        "{hadith.text}"
      </motion.p>
      <p className="text-sm text-gray-500">– {hadith.source}</p>
    </motion.div>
  )
}
