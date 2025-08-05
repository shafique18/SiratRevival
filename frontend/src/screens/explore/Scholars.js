// pages/Scholars.js
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const Scholars = () => {
  const { language } = useContext(LanguageContext);
  const [scholars, setScholars] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetch('/api/scholars')
      .then(res => res.json())
      .then(setScholars);
  }, []);

  useEffect(() => {
    if (selected)
      fetch(`/api/scholars/${selected}?lang=${language}`)
        .then(res => res.json())
        .then(setContent);
  }, [selected, language]);

  return (
    <div className="p-6">
      <select onChange={e => setSelected(e.target.value)}>
        <option>Select Scholar</option>
        {scholars.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <div className="mt-4">
        {content.map((item, idx) => (
          <div key={idx} className="mb-4">
            {item.type === 'video' ? (
              <video controls src={item.translated_url} />
            ) : (
              <p>{item.translated_text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scholars;
