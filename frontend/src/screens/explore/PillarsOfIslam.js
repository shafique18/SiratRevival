import React, { useEffect, useState, useRef, useContext } from 'react';
import Layout from "../../components/layout/Layout";
import axios from 'axios';
import LanguageContext from "../../context/LanguageContext"; // use your current language

const LANGUAGES = ['en', 'ar', 'de', 'es', 'fr', 'pt', 'hi', 'ur', 'id', 'ja', 'zh', 'tr', 'it'];

export default function PillarsPage() {
  const [pillars, setPillars] = useState(null);
  const { language } = useContext(LanguageContext); // Get current language from context
  const audioRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:8000/content/pillars')
      .then(res => {
        setPillars(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch pillars data:", err);
      });
  }, []);

  useEffect(() => {
    if (pillars?.sections?.length > 0) {
      const firstSection = pillars.sections[0];
      const translation = firstSection.translations?.find(t => t.language === language)
                        || firstSection.translations?.find(t => t.language === 'en');

      if (translation && translation.audio_url && audioRef.current) {
        audioRef.current.src = translation.audio_url;
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
      }
    }
  }, [pillars, language]);

  const handleVolume = (e) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.value;
    }
  };

  return (
    <Layout>
      <div className="p-4">
        {/* Optional: You can expose language selector here if needed */}
        {/* <select value={language} onChange={e => setLanguage(e.target.value)}>...</select> */}

        {pillars?.sections?.map((sec) => {
          const translation = sec.translations?.find(t => t.language === language)
                            || sec.translations?.find(t => t.language === 'en');

          if (!translation) return null;

          return (
            <section key={sec.section_key} className="my-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{sec.title}</h2>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: translation.text }}
              />
            </section>
          );
        })}

        <audio ref={audioRef} hidden />

        <div className="fixed bottom-24 right-4 bg-gray-100 dark:bg-gray-700 p-2 rounded shadow">
          <label className="text-gray-800 dark:text-gray-100">Volume: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="0.2"
            onChange={handleVolume}
          />
        </div>
      </div>
    </Layout>
  );
}
