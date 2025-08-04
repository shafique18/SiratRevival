import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";

import avatar from "../../static/images/avatar.png";
import Layout from "../../components/layout/Layout";
import firstVideo from "../../static/videos/first.mp4";
import secondVideo from "../../static/videos/second.mp4";
import thirdVideo from "../../static/videos/third.mp4";
import fourthVideo from "../../static/videos/fourth.mp4";

const sections = [
  {
    id: "intro",
    title: "Introduction",
    videoSrc: firstVideo,
    text: (
      <>
        <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
          Welcome to Sirat Revival
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-white drop-shadow-md">
          Discover the mission and the spirit behind the revival.
        </p>
      </>
    ),
  },
  {
    id: "purpose-objective",
    title: "Purpose & Objective",
    videoSrc: secondVideo,
    text: (
      <>
        <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
          Purpose & Objective
        </h2>
        <p className="max-w-3xl mx-auto text-white drop-shadow-md text-lg">
          Learn the core objectives that drive our movement forward.
        </p>
      </>
    ),
  },
  {
    id: "vision-mission",
    title: "Vision & Mission",
    videoSrc: thirdVideo,
    text: (
      <>
        <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
          Vision & Mission
        </h2>
        <p className="max-w-3xl mx-auto text-white drop-shadow-md text-lg">
          Our vision and mission statements that shape our goals.
        </p>
      </>
    ),
  },
  {
    id: "why-sirat-revival",
    title: "Why is the Sirat Revival?",
    videoSrc: fourthVideo,
    text: (
      <>
        <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
          Why is the Sirat Revival?
        </h2>
        <p className="max-w-3xl mx-auto text-white drop-shadow-md text-lg">
          Understand the necessity and impact of the revival movement.
        </p>
      </>
    ),
  },
];

const roleLabels = {
  SCHOLAR: "Scholars",
  WRITER: "Writers",
  REVIEWER: "Reviewers",
};

function ContributorsSection() {
  const [contributors, setContributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/users/contributors")
      .then((res) => {
        setContributors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch contributors error:", err);
        setLoading(false);
      });
  }, []);

  const filtered = contributors.filter((c) => {
    const fullName = [c.first_name, c.middle_name, c.last_name]
      .filter(Boolean)
      .join(" ");
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const grouped = filtered.reduce((acc, curr) => {
    const role = curr.user_role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(curr);
    return acc;
  }, {});

  return (
    <section
      id="contributors"
      className="relative w-full min-h-screen py-20 bg-gray-50 dark:bg-gray-900 flex flex-col justify-start items-center px-6 md:px-20 max-w-7xl mx-auto"
      tabIndex={-1}
    >
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center">
        Application Contributors
      </h2>

      <input
        type="text"
        placeholder="Search contributors by name..."
        className="w-full max-w-xl mx-auto block mb-12 px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading contributors...
        </p>
      )}

      {!loading &&
        Object.entries(grouped).map(([role, users]) => (
          <div key={role} className="mb-14 w-full">
            <h3 className="text-3xl font-semibold text-blue-700 dark:text-blue-400 mb-6 border-b-2 border-blue-700 dark:border-blue-400 pb-1">
              {roleLabels[role] || role}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {users.map((user) => {
                const fullName = [user.first_name, user.middle_name, user.last_name]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
                  >
                    <img
                      src={user.profile_picture || avatar}
                      alt={fullName}
                      className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-blue-100 dark:border-blue-900"
                      loading="lazy"
                    />

                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {fullName}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">
                      {user.user_role}
                    </p>

                    <ul className="text-left text-gray-700 dark:text-gray-300 text-sm space-y-1 w-full max-w-xs">
                      <li>
                        <span className="font-semibold">Gender:</span>{" "}
                        {user.gender || "N/A"}
                      </li>
                      <li>
                        <span className="font-semibold">Nationality:</span>{" "}
                        {user.nationality || "N/A"}
                      </li>
                      <li>
                        <span className="font-semibold">Time Zone:</span>{" "}
                        {user.time_zone || "N/A"}
                      </li>
                      <li>
                        <span className="font-semibold">Language Proficiency:</span>{" "}
                        {user.language_proficiency || "N/A"}
                      </li>
                      <li>
                        <span className="font-semibold">Occupation:</span>{" "}
                        {user.occupation || "N/A"}
                      </li>
                      <li>
                        <span className="font-semibold">Highest Qualification:</span>{" "}
                        {user.highest_qualification || "N/A"}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-12 text-lg">
          No contributors found.
        </p>
      )}
    </section>
  );
}

// Section component with lazy loading and fade-in
const Section = ({ id, videoSrc, text }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setVisible(true);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      tabIndex={-1}
    >
      {visible && (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover brightness-50"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="relative z-10 px-6">{text}</div>
        </>
      )}
    </section>
  );
};

export default function AboutUs() {
  const location = useLocation();
  const navbarHeight = 70; // Adjust as per your navbar height
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    setPageVisible(true); // fade in on mount
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      if (location.hash) {
        const id = location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const y =
            el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };

    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [location]);

  return (
    <Layout>
      <main
        className={`relative w-full m-0 p-0 transition-opacity duration-800 ${
          pageVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {sections.map(({ id, videoSrc, text }) => (
          <Section key={id} id={id} videoSrc={videoSrc} text={text} />
        ))}

        <ContributorsSection />
      </main>
    </Layout>
  );
}
