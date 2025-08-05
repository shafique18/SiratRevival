// pages/PillarsOfIslam.js
import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import useAudio from '../hooks/useAudio';

const PillarsOfIslam = () => {
  const { language } = useContext(LanguageContext);
  const [message, setMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const { playAudio } = useAudio(audioUrl);

  useEffect(() => {
    fetch(`/api/pillars?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setAudioUrl(data.audioUrl);
      });

    const timer = setTimeout(() => {
      playAudio();
    }, 3000);
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pillars of Islam</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default PillarsOfIslam;
