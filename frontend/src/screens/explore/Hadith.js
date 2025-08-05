// pages/Hadith.js
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const Hadith = () => {
  const { language } = useContext(LanguageContext);
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState('');
  const [hadiths, setHadiths] = useState([]);

  useEffect(() => {
    fetch('/api/hadith/collections')
      .then(res => res.json())
      .then(setCollections);
  }, []);

  useEffect(() => {
    if (selected)
      fetch(`/api/hadith/${selected}?lang=${language}`)
        .then(res => res.json())
        .then(setHadiths);
  }, [selected, language]);

  return (
    <div className="p-6">
      <select onChange={e => setSelected(e.target.value)}>
        <option>Select Hadith Collection</option>
        {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {hadiths.map(h => (
        <div key={h.id} className="my-4 p-4 border rounded">
          <p>{h.text}</p>
          <small>{h.explanation}</small>
        </div>
      ))}
    </div>
  );
};

export default Hadith;
