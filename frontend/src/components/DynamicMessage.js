import React, { useState, useEffect } from "react";

const messages = [
  {
    quote: "Indeed, with hardship comes ease.",
    author: "Qur'an 94:6",
  },
  {
    quote: "The best among you are those who have the best manners and character.",
    author: "Prophet Muhammad (PBUH)",
  },
  {
    quote: "Seek knowledge from the cradle to the grave.",
    author: "Prophet Muhammad (PBUH)",
  },
];

const STORAGE_KEY = "dynamicMessageIndex";

const DynamicMessage = () => {
  const [messageIndex, setMessageIndex] = useState(null);

  useEffect(() => {
    // Check if we already have one stored in sessionStorage
    const storedIndex = sessionStorage.getItem(STORAGE_KEY);

    if (storedIndex !== null && !isNaN(storedIndex)) {
      setMessageIndex(parseInt(storedIndex, 10));
    } else {
      // Pick random index and save it for this session
      const randomIndex = Math.floor(Math.random() * messages.length);
      sessionStorage.setItem(STORAGE_KEY, randomIndex);
      setMessageIndex(randomIndex);
    }
  }, []);

  if (messageIndex === null) return null; // or a loader if you want

  const { quote, author } = messages[messageIndex];

  return (
    <div>
        <p>{quote}</p>
      <footer className="mt-4 text-sm font-normal not-italic text-green-600 dark:text-green-400">— {author}</footer>
    </div>
  );
};

export default DynamicMessage;
