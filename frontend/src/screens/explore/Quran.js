// pages/Quran.js
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const Quran = () => {
  const { language } = useContext(LanguageContext);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentAyah, setCurrentAyah] = useState(null);

  useEffect(() => {
    fetch('/api/quran/surahs')
      .then(res => res.json())
      .then(setSurahs);
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      fetch(`/api/quran/${selectedSurah}?lang=${language}`)
        .then(res => res.json())
        .then(data => {
          setAyahs(data.ayahs);
          setAudioUrl(data.audioUrl);
        });
    }
  }, [selectedSurah, language]);

  return (
    <div className="p-6">
      <select onChange={e => setSelectedSurah(e.target.value)}>
        <option>Select Surah</option>
        {surahs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <div className="mt-4">
        {ayahs.map((ayah, idx) => (
          <p
            key={ayah.number}
            className={`py-1 ${currentAyah === idx ? 'bg-green-100' : ''}`}
          >
            {ayah.text}
          </p>
        ))}
      </div>

      {audioUrl && (
        <audio
          controls
          src={audioUrl}
          onTimeUpdate={e => {
            // Syncing logic based on timestamps (mocked here)
            const time = e.target.currentTime;
            const ayahIdx = Math.floor(time / 5); // For example, each ayah 5s
            setCurrentAyah(ayahIdx);
          }}
        />
      )}
    </div>
  );
};

export default Quran;
