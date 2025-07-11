import React, { useEffect, useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const PrayerTimesWidget = ({ isDesktop, isOpen, toggleOpen }) => {
  const [times, setTimes] = useState({});
  const [city, setCity] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await res.json();
      setTimes(data.data.timings);
      setCity(data.data.meta.timezone);
    });
  }, []);

  if (isDesktop) {
    return (
      <>
        {/* Toggle button always visible */}
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? "Close Prayer Times" : "Open Prayer Times"}
          className={`
            fixed top-28 left-0 z-50 flex items-center justify-center
            w-10 h-14
            bg-green-600 hover:bg-green-700
            text-white
            rounded-tr-md rounded-br-md
            shadow-lg
            focus:outline-none
            transition-colors duration-300
          `}
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* Prayer times panel with left padding to avoid toggle overlap */}
        <aside
          className={`
            fixed top-20 left-0 z-40 bg-white dark:bg-gray-800
            shadow-2xl rounded-r-lg px-6 py-5
            max-w-xs w-72
            border border-gray-300 dark:border-gray-700
            transition-transform duration-300 ease-in-out
            overflow-auto max-h-[70vh]
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            pl-[48px]  /* padding to leave space for toggle */
          `}
          aria-hidden={!isOpen}
        >
          <div className="flex items-center gap-3 mb-5 text-green-700 dark:text-green-400 font-semibold text-xl select-none">
            <Clock className="h-6 w-6" />
            <span>Prayer Times</span>
          </div>
          <div className="space-y-2 text-gray-800 dark:text-gray-200 text-sm">
            {Object.entries(times).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
          {city && (
            <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 italic select-none">
              Timezone: {city}
            </p>
          )}
        </aside>
      </>
    );
  }

  // Mobile view unchanged
  return (
    <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 max-w-md mx-auto border border-gray-300 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4 text-green-700 dark:text-green-400 font-semibold text-lg select-none">
        <Clock className="h-5 w-5" />
        <h2>Prayer Times</h2>
      </div>
      <div className="space-y-1 text-gray-800 dark:text-gray-200 text-sm">
        {Object.entries(times).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="capitalize">{key}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
      {city && (
        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 italic select-none">
          Timezone: {city}
        </p>
      )}
    </section>
  );
};

export default PrayerTimesWidget;
