// pages/TodayInHistory.js
import React, { useEffect, useState } from 'react';

const TodayInHistory = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/history/today')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Today in Islamic History</h1>
      <ul>
        {events.map((e, idx) => (
          <li key={idx} className="mb-3 bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl">{e.title}</h3>
            <p>{e.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayInHistory;
