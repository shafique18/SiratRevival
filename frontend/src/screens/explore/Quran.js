// pages/QuranReader.js
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";

const QuranReader = () => {
  const [surahList, setSurahList] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState("");
  const [verses, setVerses] = useState({ basmala: null, verses: [] });
  const [translations, setTranslations] = useState([]);
  const [selectedTranslations, setSelectedTranslations] = useState(["en", "ur"]);
  const [reciter, setReciter] = useState("Mishary Rashid Alafasy");

  // Fetch all surah names
  useEffect(() => {
    fetch("http://localhost:8000/content/quran/surah_names")
      .then((res) => res.json())
      .then((data) => {
        setSurahList(data.surah_names);
        if (data.surah_names.length > 0) setSelectedSurah(data.surah_names[0]);
      });
  }, []);

  // Fetch selected surah verses
useEffect(() => {
  if (!selectedSurah) return;
  fetch(`http://localhost:8000/content/quran/surah/${encodeURIComponent(selectedSurah)}`)
    .then((res) => res.json())
    .then((data) => setVerses(data));   // store whole object, not just verses
}, [selectedSurah]);

  // Fetch available translations
  useEffect(() => {
    fetch("http://localhost:8000/content/quran/translations")
      .then((res) => res.json())
      .then((data) => setTranslations(data));
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        
        {/* Left Sidebar - Surah List */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
          <h2 className="font-bold mb-4 text-right text-lg">📖 السور</h2>
          <ul className="space-y-2 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {surahList.map((s, index) => (
              <li
                key={s}
                className={`p-2 rounded-lg cursor-pointer text-right flex justify-between transition-all duration-200 ${
                  selectedSurah === s
                    ? "bg-emerald-500 text-white shadow"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedSurah(s)}
              >
                <span className="font-semibold">{s}</span>
                <span className="text-sm opacity-70">{index + 1}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center Quran Text */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {selectedSurah && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center md:text-right">
              {selectedSurah}
            </h1>

            {/* Show Basmala at top (if exists) */}
            {verses.basmala && (
            <div className="p-5 mb-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
              <div className="text-3xl leading-relaxed font-arabic text-center text-emerald-600">
                {verses.basmala.arabic}
              </div>
            </div>
          )}

            <div className="space-y-6">
              {verses.verses.map((v) => (
                <div key={v.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md border">
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Surah - {v.surah} : Ayah - {v.ayah}
                  </div>
                  <div className="text-3xl leading-relaxed font-arabic text-right mb-3">
                    {v.arabic}
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 mb-2">
                    {v.default_translation}
                  </div>

                  {v.translations
                    .filter((t) => selectedTranslations.includes(t.language))
                    .map((t, i) => (
                      <div key={i} className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <strong className="capitalize">{t.language}:</strong> {t.translation}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </>
        )}
      </main>


        {/* Right Sidebar - Translations */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md p-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
          <h2 className="font-bold mb-4 text-lg">🌍 Translations</h2>
          <ul className="space-y-2">
            {translations.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedTranslations.includes(t.code)}
                  onChange={() =>
                    setSelectedTranslations((prev) =>
                      prev.includes(t.code)
                        ? prev.filter((x) => x !== t.code)
                        : [...prev, t.code]
                    )
                  }
                />
                <span>{t.name}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Layout>
  );
};

export default QuranReader;
