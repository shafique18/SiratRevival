import React, { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";
import PrayerTimesWidget from "../utils/PrayerTimesWidget";
import BismillahSection from "./BismillahSection";
import AuthContext from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [prayerOpen, setPrayerOpen] = useState(true);
  const [showBismillah, setShowBismillah] = useState(true);

  const updateNavbarHeight = () => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateNavbarHeight();
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setPrayerOpen(desktop);
      updateNavbarHeight();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateNavbarHeight();
  }, [isAuthenticated]);

  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar ref={navbarRef} />

        {/* Spacer equal to Navbar height */}
        <div style={{ height: navbarHeight }} />

        {/* Bismillah Section */}
        {showBismillah && (
          <BismillahSection
            navbarHeight={navbarHeight}
            onHide={() => setShowBismillah(false)}
          />
        )}

        {/* Floating Prayer Widget for desktop */}
        {isDesktop && (
          <div
            style={{
              position: "fixed",
              top: navbarHeight + (showBismillah ? 48 : 0), // Adjust if Bismillah visible
              right: 0,
              zIndex: 40,
            }}
          >
            <PrayerTimesWidget
              isDesktop={true}
              isOpen={prayerOpen}
              toggleOpen={() => setPrayerOpen(!prayerOpen)}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-0 m-0">
          {children}

          {/* Embedded Prayer Widget for mobile */}
          {!isDesktop && (
            <div className="px-4 my-8">
              <PrayerTimesWidget isDesktop={false} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
