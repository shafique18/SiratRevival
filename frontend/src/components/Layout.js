import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PrayerTimesWidget from "./PrayerTimesWidget";

const Layout = ({ children }) => {
  // Detect desktop breakpoint
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [prayerOpen, setPrayerOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) setPrayerOpen(false);
      else setPrayerOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 container mx-auto relative">
        {isDesktop ? (
          <>
            <PrayerTimesWidget
              isDesktop={true}
              isOpen={prayerOpen}
              toggleOpen={() => setPrayerOpen(!prayerOpen)}
            />
            {/* Content with margin-left only when prayerOpen */}
            <div
              className={`transition-margin duration-300 ease-in-out ${
                prayerOpen ? "lg:ml-[18rem]" : "lg:ml-0"
              }`}
            >
              {children}
            </div>
          </>
        ) : (
          <>
            {children}
            <PrayerTimesWidget isDesktop={false} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
