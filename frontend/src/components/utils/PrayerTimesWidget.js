import React, { useEffect, useState, useRef } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const PrayerTimesWidget = ({ isDesktop, isOpen, toggleOpen }) => {
  const [times, setTimes] = useState({});
  const [city, setCity] = useState("");
  const [dragY, setDragY] = useState(100); // Initial vertical position in px
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startDragYRef = useRef(0);

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

  // Mouse / touch handlers for drag
  const onDragStart = (e) => {
    draggingRef.current = true;
    startYRef.current = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    startDragYRef.current = dragY;
    e.preventDefault();
  };

  const onDragMove = (e) => {
    if (!draggingRef.current) return;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    let newY = startDragYRef.current + (clientY - startYRef.current);

    // Clamp newY between 40px and window height - button height - 40px
    const minY = 40;
    const maxY = window.innerHeight - 56 - 40; // 56px button height, 40px padding
    if (newY < minY) newY = minY;
    if (newY > maxY) newY = maxY;

    setDragY(newY);
  };

  const onDragEnd = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchend", onDragEnd);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("touchmove", onDragMove, { passive: false });
    return () => {
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchend", onDragEnd);
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("touchmove", onDragMove);
    };
  }, []);

  if (isDesktop) {
    return (
      <>
        {/* Toggle button on right side, draggable vertically */}
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? "Close Prayer Times" : "Open Prayer Times"}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          style={{ top: dragY, right: 0, position: "fixed", zIndex: 50 }}
          className={`
            flex items-center justify-center
            w-14 h-14
            bg-green-600 hover:bg-green-700
            text-white
            rounded-tl-md rounded-bl-md
            shadow-lg
            focus:outline-none
            transition-colors duration-300
            cursor-grab
            select-none
          `}
        >
          {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        {/* Prayer times panel sliding from right */}
        <aside
          className={`
            fixed top-20 right-0 z-40 bg-white dark:bg-gray-800
            shadow-2xl rounded-l-lg px-6 py-5
            max-w-xs w-72
            border border-gray-300 dark:border-gray-700
            transition-transform duration-300 ease-in-out
            overflow-auto max-h-[70vh]
            ${isOpen ? "translate-x-0" : "translate-x-full"}
            pr-[56px]  /* padding for toggle button */
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

  // Mobile unchanged
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
