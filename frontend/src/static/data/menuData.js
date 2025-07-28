// src/data/menuData.js
import { FaBookOpen, FaFileAlt, FaVideo, FaNewspaper, FaQuestionCircle, FaHome } from "react-icons/fa";

const menuData = {
  GROUP_0_5: [
    {
      title: "Quran",
      columns: [
        {
          heading: "Read & Listen",
          links: [
            { name: "Read Quran", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Audio Quran", path: "/quran/audio", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Articles",
      columns: [
        {
          heading: "Topics",
          links: [
            { name: "Islamic Lifestyle", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "History", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Videos", path: "/videos", icon: <FaVideo /> },
    { title: "News", path: "/news", icon: <FaNewspaper /> },
    { title: "Quiz", path: "/quiz", icon: <FaQuestionCircle /> },
    { title: "About", path: "/about", icon: <FaFileAlt /> },
    { title: "Contact", path: "/contact", icon: <FaFileAlt /> },
  ],

  GROUP_6_15: [
    {
      title: "Quran",
      columns: [
        {
          heading: "Read & Listen",
          links: [
            { name: "Read Quran", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Audio Quran", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Tafsir", path: "/quran/tafsir", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Resources",
          links: [
            { name: "Translations", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Memorization Tools", path: "/quran/memorization", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Hadith",
      columns: [
        {
          heading: "Collections",
          links: [
            { name: "Sahih Bukhari", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Sahih Muslim", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Other Collections", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Study",
          links: [
            { name: "Hadith Explanation", path: "/hadith/explanation", icon: <FaFileAlt /> },
            { name: "Scholars", path: "/hadith/scholars", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Articles", path: "/articles", icon: <FaFileAlt /> },
    { title: "Videos", path: "/videos", icon: <FaVideo /> },
    { title: "News", path: "/news", icon: <FaNewspaper /> },
    { title: "Quiz", path: "/quiz", icon: <FaQuestionCircle /> },
    { title: "About", path: "/about", icon: <FaFileAlt /> },
    { title: "Contact", path: "/contact", icon: <FaFileAlt /> },
  ],

  GROUP_16_25: [
    {
      title: "Quran",
      columns: [
        {
          heading: "Read & Listen",
          links: [
            { name: "Read Quran", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Audio Quran", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Tafsir", path: "/quran/tafsir", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Resources",
          links: [
            { name: "Translations", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Memorization Tools", path: "/quran/memorization", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Hadith",
      columns: [
        {
          heading: "Collections",
          links: [
            { name: "Sahih Bukhari", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Sahih Muslim", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Other Collections", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Study",
          links: [
            { name: "Hadith Explanation", path: "/hadith/explanation", icon: <FaFileAlt /> },
            { name: "Scholars", path: "/hadith/scholars", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Articles", path: "/articles", icon: <FaFileAlt /> },
    { title: "Videos", path: "/videos", icon: <FaVideo /> },
    { title: "News", path: "/news", icon: <FaNewspaper /> },
    { title: "Quiz", path: "/quiz", icon: <FaQuestionCircle /> },
    { title: "About", path: "/about", icon: <FaFileAlt /> },
    { title: "Contact", path: "/contact", icon: <FaFileAlt /> },
  ],
  
  GROUP_26_PLUS: [
    {
      title: "Quran",
      columns: [
        {
          heading: "Read & Listen",
          links: [
            { name: "Read Quran", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Audio Quran", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Tafsir", path: "/quran/tafsir", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Resources",
          links: [
            { name: "Translations", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Memorization Tools", path: "/quran/memorization", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Hadith",
      columns: [
        {
          heading: "Collections",
          links: [
            { name: "Sahih Bukhari", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Sahih Muslim", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Other Collections", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Study",
          links: [
            { name: "Hadith Explanation", path: "/hadith/explanation", icon: <FaFileAlt /> },
            { name: "Scholars", path: "/hadith/scholars", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Articles", path: "/articles", icon: <FaFileAlt /> },
    { title: "Videos", path: "/videos", icon: <FaVideo /> },
    { title: "News", path: "/news", icon: <FaNewspaper /> },
    { title: "Quiz", path: "/quiz", icon: <FaQuestionCircle /> },
    { title: "About", path: "/about", icon: <FaFileAlt /> },
    { title: "Contact", path: "/contact", icon: <FaFileAlt /> },
  ],

  ADMIN: [
    {
      title: "Users",
      path: "/admin/dashboard",
      icon: <FaFileAlt />,
    },
    {
      title: "Content",
      columns: [
        {
          heading: "Content",
          links: [
            { name: "By Creator", path: "/admin/users", icon: <FaFileAlt /> },
            { name: "Application", path: "/admin/roles", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "AI Tools & Model Management", path: "/admin/settings", icon: <FaFileAlt /> },
    { title: "Language & Localization Management", path: "/admin/settings", icon: <FaFileAlt /> },
    { title: "Donation & Sponsorship Management", path: "/admin/settings", icon: <FaFileAlt /> },
    { title: "Moderation & Community Management", path: "/admin/settings", icon: <FaFileAlt /> },
    { title: "Notifications & Communication", path: "/admin/settings", icon: <FaFileAlt /> },
    { title: "Knowledge & Help Center Management", path: "/admin/settings", icon: <FaFileAlt /> },
    {
      title: "Analytics & Reports",
      columns: [
        {
          heading: "Analytics & Reports",
          links: [
            { name: "View Usage Statistics", path: "/admin/users", icon: <FaFileAlt /> },
            { name: "Download or Schedule Reports", path: "/admin/roles", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
  ],
  
  WRITER: [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaFileAlt />,
    },
    {
      title: "User Management",
      columns: [
        {
          heading: "Users",
          links: [
            { name: "All Users", path: "/admin/users", icon: <FaFileAlt /> },
            { name: "Roles", path: "/admin/roles", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Content Management",
      columns: [
        {
          heading: "Manage Content",
          links: [
            { name: "Articles", path: "/admin/articles", icon: <FaFileAlt /> },
            { name: "Videos", path: "/admin/videos", icon: <FaFileAlt /> },
            { name: "News", path: "/admin/news", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Settings", path: "/admin/settings", icon: <FaFileAlt /> },
  ],
  
  REVIEWER: [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaFileAlt />,
    },
    {
      title: "User Management",
      columns: [
        {
          heading: "Users",
          links: [
            { name: "All Users", path: "/admin/users", icon: <FaFileAlt /> },
            { name: "Roles", path: "/admin/roles", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Content Management",
      columns: [
        {
          heading: "Manage Content",
          links: [
            { name: "Articles", path: "/admin/articles", icon: <FaFileAlt /> },
            { name: "Videos", path: "/admin/videos", icon: <FaFileAlt /> },
            { name: "News", path: "/admin/news", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Settings", path: "/admin/settings", icon: <FaFileAlt /> },
  ],
  
  SCHOLOR: [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaFileAlt />,
    },
    {
      title: "User Management",
      columns: [
        {
          heading: "Users",
          links: [
            { name: "All Users", path: "/admin/users", icon: <FaFileAlt /> },
            { name: "Roles", path: "/admin/roles", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Content Management",
      columns: [
        {
          heading: "Manage Content",
          links: [
            { name: "Articles", path: "/admin/articles", icon: <FaFileAlt /> },
            { name: "Videos", path: "/admin/videos", icon: <FaFileAlt /> },
            { name: "News", path: "/admin/news", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    { title: "Settings", path: "/admin/settings", icon: <FaFileAlt /> },
  ],

  GUEST: [
    { title: "Home", path: "/", icon: <FaHome /> },
    {
      title: "About us",
      columns: [
        {
          heading: "About us",
          links: [
            { name: "Purpose & Objective", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Vision & Mission", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Why is the Sirat Revival?", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Contributors", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Explore",
      columns: [
        {
          heading: "Explore",
          links: [
            { name: "Pillars of Islam", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Quran", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Hadith", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Scholars", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Posts", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Discussion", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Today on Islamic history", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Get Involved",
      columns: [
        {
          heading: "Get Involved",
          links: [
            { name: "Contributor", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Partner", path: "/articles/history", icon: <FaFileAlt /> },
            { name: " tech-Savvy", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "News",
      columns: [
        {
          heading: "News",
          links: [
            { name: "Global Islamic news", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Sirat Revival platform updates", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "New content releases", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Campaigns", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Contact us",
      columns: [
        {
          heading: "Contact us",
          links: [
            { name: "General", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Feedback", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Suggestions", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Report", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "FAQs", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
  ],
};

export default menuData;
