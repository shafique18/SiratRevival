import React, { useEffect, useState, useRef } from "react";
import { Clock, ChevronLeft, ChevronRight, Sun, Moon, Sunrise, Sunset, Star, Watch } from "lucide-react";

const prayerIcons = {
  Fajr: <Moon className="inline-block mr-2 h-5 w-5 text-green-600" />,
  Sunrise: <Sunrise className="inline-block mr-2 h-5 w-5 text-yellow-500" />,
  Dhuhr: <Sun className="inline-block mr-2 h-5 w-5 text-yellow-600" />,
  Asr: <Sun className="inline-block mr-2 h-5 w-5 text-orange-500" />,
  Sunset: <Sunset className="inline-block mr-2 h-5 w-5 text-red-600" />,
  Maghrib: <Sunset className="inline-block mr-2 h-5 w-5 text-red-600" />,
  Isha: <Star className="inline-block mr-2 h-5 w-5 text-purple-700" />,
  Imsak: <Watch className="inline-block mr-2 h-5 w-5 text-gray-500" />,
  Midnight: <Star className="inline-block mr-2 h-5 w-5 text-gray-700" />,
  Firstthird: <Star className="inline-block mr-2 h-5 w-5 text-gray-400" />,
  Lastthird: <Star className="inline-block mr-2 h-5 w-5 text-gray-400" />,
};

const PrayerTimesWidget = ({ isDesktop, isOpen, toggleOpen }) => {
  const [times, setTimes] = useState({});
  const [city, setCity] = useState("");
  const [dragY, setDragY] = useState(100);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startDragYRef = useRef(0);

  // Read initial open state from sessionStorage or fallback to prop isOpen
  const getInitialOpenState = () => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("prayerWidgetOpen");
      if (stored !== null) return stored === "true";
    }
    return isOpen;
  };

  const [widgetOpen, setWidgetOpen] = useState(getInitialOpenState);

  useEffect(() => {
    // Sync with prop only if there's no stored preference yet
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("prayerWidgetOpen");
      if (stored === null) {
        setWidgetOpen(isOpen);
      }
    }
  }, [isOpen]);

  // Save widget open state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("prayerWidgetOpen", widgetOpen.toString());
    }
  }, [widgetOpen]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const data = await res.json();
        setTimes(data.data.timings);
        setCity(data.data.meta.timezone);
      } catch (error) {
        console.error("Failed to fetch prayer times:", error);
      }
    }, () => {
    setTimes({ error: "Location permission denied. Please enable location services." });
  });
  }, []);

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

    const minY = 40;
    const maxY = window.innerHeight - 56 - 40;
    newY = Math.max(minY, Math.min(maxY, newY));

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

  const formatPrayerName = (name) => {
    const mapping = {
      Fajr: "Fajr",
      Sunrise: "Sunrise",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Sunset: "Sunset",
      Maghrib: "Maghrib",
      Isha: "Isha",
      Imsak: "Imsak",
      Midnight: "Midnight",
      Firstthird: "First Third",
      Lastthird: "Last Third",
    };
    return mapping[name] || name.replace(/([A-Z])/g, " $1").trim();
  };

  const handleToggle = () => {
    const newOpen = !widgetOpen;
    toggleOpen();
    setWidgetOpen(newOpen);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("prayerWidgetOpen", newOpen.toString());
    }
  };

  const openUpwards = dragY > window.innerHeight * 0.65;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        aria-label={widgetOpen ? "Close Prayer Times" : "Open Prayer Times"}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        style={{
          top: dragY,
          right: 0,
          position: "fixed",
          zIndex: 60,
          userSelect: "none",
          cursor: draggingRef.current ? "grabbing" : "grab",
          width: 56,
          height: 56,
          backgroundColor: widgetOpen ? "#16a34a" : "#10b981",
          color: "white",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.15), 0 0 10px rgba(16, 185, 129, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease",
        }}
      >
        {widgetOpen ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
      </button>

      {/* Widget panel */}
      <aside
        className={`
          fixed right-0 z-50 bg-white dark:bg-gray-900
          shadow-2xl rounded-l-lg px-6 py-6
          border border-gray-300 dark:border-gray-700
          transition-transform duration-500 ease-in-out
          overflow-auto max-h-[72vh]
          select-none
          w-72 sm:w-80 md:w-96
        `}
        style={{
          top: openUpwards ? dragY - 60 - 450 /* increased height */ : dragY + 56,
          maxHeight: 450,
          transform: widgetOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-hidden={!widgetOpen}
      >
        <div className="flex items-center gap-3 mb-6 text-green-700 dark:text-green-400 font-semibold text-2xl select-none">
          <Clock className="h-7 w-7" />
          <span>Prayer Times</span>
        </div>
        <div className="space-y-3 text-gray-900 dark:text-gray-100 text-base font-medium leading-relaxed">
          {Object.entries(times).length === 0 ? (
            <p className="italic text-gray-500 dark:text-gray-400">
              Loading prayer times...
            </p>
          ) : (
            Object.entries(times).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2"
              >
                <span className="capitalize flex items-center">
                  {prayerIcons[key] || null}
                  {formatPrayerName(key)}
                </span>
                <span className="font-semibold">{value}</span>
              </div>
            ))
          )}
        </div>
        {city && (
          <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 italic select-none tracking-wide">
            Timezone: <span className="font-semibold">{city}</span>
          </p>
        )}
      </aside>
    </>
  );
};

export default PrayerTimesWidget;
