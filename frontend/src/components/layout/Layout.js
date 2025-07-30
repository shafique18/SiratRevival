import React, { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";
import PrayerTimesWidget from "../utils/PrayerTimesWidget";
import BismillahSection from "./BismillahSection";
import AuthContext from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // listen to auth changes

  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [prayerOpen, setPrayerOpen] = useState(true);

  // Function to update navbar height
  const updateNavbarHeight = () => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateNavbarHeight(); // initial measurement
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setPrayerOpen(desktop);
      updateNavbarHeight();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Also update navbar height whenever auth state changes (login/logout)
  useEffect(() => {
    updateNavbarHeight();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar ref={navbarRef} />

      {/* Spacer equal to Navbar height to push content below */}
      <div style={{ height: navbarHeight }} />

      {/* Bismillah Bar positioned right below navbar */}
      <div
        style={{
          position: "sticky",
          top: navbarHeight,
          zIndex: 999,
          backgroundColor: "inherit",
          borderBottom: "1px solid rgba(229, 231, 235, 1)", // matches border-b border-gray-200
        }}
      >
        <BismillahSection />
      </div>

      {/* Floating Prayer Widget */}
      {isDesktop && (
        <div style={{ position: "fixed", top: navbarHeight + 48, right: 0, zIndex: 40 }}>
          {/* 48px = approx BismillahSection height, adjust if needed */}
          <PrayerTimesWidget
            isDesktop={true}
            isOpen={prayerOpen}
            toggleOpen={() => setPrayerOpen(!prayerOpen)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-8 px-4">
        {children}

        {/* Embedded prayer widget on mobile before footer */}
        {!isDesktop && (
          <div className="px-4 my-8">
            <PrayerTimesWidget isDesktop={false} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
