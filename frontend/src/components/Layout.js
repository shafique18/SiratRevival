import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PrayerTimesWidget from "./PrayerTimesWidget";

const Layout = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [prayerOpen, setPrayerOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setPrayerOpen(desktop); // default open only for desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      {/* Floating prayer widget */}
      {isDesktop && (
        <div className="fixed top-16 right-0 z-40">
          <PrayerTimesWidget
            isDesktop={true}
            isOpen={prayerOpen}
            toggleOpen={() => setPrayerOpen(!prayerOpen)}
          />
        </div>
      )}

      <main className="flex-1 flex overflow-hidden pt-16">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
