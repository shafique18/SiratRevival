// src/data/menuData.js
import { FaBookOpen, FaFileAlt, FaVideo, FaNewspaper, FaQuestionCircle, FaHome } from "react-icons/fa";

const menuData = {
  GROUP_0_5: [
    { title: "Home", path: "/videos", icon: <FaVideo /> },
    { title: "My First Islam", path: "/videos", icon: <FaVideo /> },
    {
      title: "Stories",
      columns: [
        {
          heading: "Stories",
          links: [
            { name: "Shorts", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Quran", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Hadith", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Sahaba", path: "/quran/audio", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Duas & Prayers",
      columns: [
        {
          heading: "Duas & Prayers",
          links: [
            { name: "Basic Duas", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Du’a Cards", path: "/quran/audio", icon: <FaFileAlt /> },
          ],
        },
         {
          heading: "Prayer Times",
          links: [
            { name: "Wudu", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Prayers", path: "/quran/audio", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Language",
      columns: [
        {
          heading: "Arabic",
          links: [
            { name: "Alphabet & Sounds", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Basic Words", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Colors & Shapes", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Numbers & Counting", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "English",
          links: [
            { name: "Alphabet & Sounds", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Basic Words", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "Colors & Shapes", path: "/articles/lifestyle", icon: <FaFileAlt /> },
            { name: "Numbers & Counting", path: "/articles/history", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Rhymes & Songs",
      columns: [
        {
          heading: "Rhymes & Songs",
          links: [
            { name: "Rhymes & Nasheeds", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Quranic Verses", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Poems", path: "/quran/read", icon: <FaBookOpen /> },
          ],
        },
      ],
    },
    {
      title: "Learning & Games",
      columns: [
        {
          heading: "Learning & Games",
          links: [
            { name: "Touch & Learn", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Match the Pairs", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Coloring Pages", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Puzzle Time", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Voice & Repeat", path: "/quran/read", icon: <FaBookOpen /> },
          ],
        },
        {
          heading: "Islamic Identifiers",
          links: [
            { name: "Masjid & Prayer Mats", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Hijab & Modesty", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Islamic Festivals", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Animals in Islam", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Islamic Objects", path: "/quran/read", icon: <FaBookOpen /> },
          ],
        },
      ],
    },
    {
      title: "Parent/Guardian",
      columns: [
        {
          heading: "Parent/Guardian",
          links: [
            { name: "Progress Reports", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Recommended Content", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Parental Controls", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Tips for Parents", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Downloadable Resources", path: "/quran/read", icon: <FaBookOpen /> },
          ],
        },
      ],
    },
  ],

  GROUP_6_15: [
    {
      title: "Know Your Islam",
      columns: [
        {
          heading: "Know Your Islam",
          links: [
            { name: "Five Pillars of Islam", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Prophets of Islam", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Daily Practices & Worship", path: "/quran/tafsir", icon: <FaFileAlt /> },
            { name: "Islamic Beliefs & Creed (Aqidah)", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Moral & Ethical Teachings", path: "/quran/tafsir", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Quran Explorer",
      columns: [
        {
          heading: "Quran Explorer",
          links: [
            { name: "Verses & Stories", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Memorization", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Contextual Understanding", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Quran & Science", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Quizzes & Games",
      columns: [
        {
          heading: "Quizzes & Games",
          links: [
            { name: "Word Games & Crosswords", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Fiqh Activities", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Moral Dilemma", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Reward System", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Story Time",
      columns: [
        {
          heading: "Story Time",
          links: [
            { name: "Prophet", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Sahaba & Women in Islam", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Quran", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Historical Episodes", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "My Daily Deeds",
      columns: [
        {
          heading: "My Daily Deeds",
          links: [
            { name: "Habit Tracker", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Reflection Journal", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Goal Setting", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Language",
      columns: [
        {
          heading: "Arabic",
          links: [
            { name: "Vocabulary Builder", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Grammar & Sentence Building", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Reading Practice", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Writing Practice", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "English",
          links: [
            { name: "Vocabulary Builder", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Grammar & Sentence Building", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Reading Practice", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Writing Practice", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Ask a Scholar",
      columns: [
        {
          heading: "Ask a Scholar",
          links: [
            { name: "AI Scholar", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Submit Questions", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Video Answers", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "FAQ", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "For me",
      columns: [
        {
          heading: "Islam & My World",
          links: [
            { name: "Islam & Family", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Friends & Community", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Society & Respect", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Women in Islam", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Interfaith Harmony", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Environmental Stewardship", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Etiquettes & Good Behavior",
          links: [
            { name: "Day-to-Day Etiquettes", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Social Behavior", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Digital Etiquette", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Conflict Resolution", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Duas & Memorization",
          links: [
            { name: "Basic to Advanced Duas", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Audio Repetition Tools", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Daily Du’a Challenge", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Quran Memorization Section", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Physical Fitness & Sunnah",
      columns: [
        {
          heading: "Physical Fitness & Sunnah",
          links: [
            { name: "Why Fitness Matters", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Prophet’s Fitness Habits", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Simple Exercises & Games", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Mind & Body Balance", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Parent & Mentor Corner",
      columns: [
        {
          heading: "Parent & Mentor Corner",
          links: [
            { name: "Child’s Progress Reports", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Recommended Content", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "Tips", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Resources for Family Discussions", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Parental Controls", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Downloadable Resources", path: "/hadith/others", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
  ],

  GROUP_16_25: [
    {
      title: "Deep Dive",
      columns: [
        {
          heading: "Qur’an & Sunnah",
          links: [
            { name: "Thematic Tafsir", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Surah Dissections", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Advanced Hadith Studies", path: "/quran/tafsir", icon: <FaFileAlt /> },
            { name: "Usul al-Hadith", path: "/quran/read", icon: <FaBookOpen /> },
            { name: "Sunnah in Today’s World", path: "/quran/audio", icon: <FaFileAlt /> },
            { name: "Prayers", path: "/quran/tafsir", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Islam & Real Life",
          links: [
            { name: "Islam & Career Choices", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Mental Health & Islam", path: "/quran/memorization", icon: <FaFileAlt /> },
            { name: "Relationships & Boundaries", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Social Justice", path: "/quran/memorization", icon: <FaFileAlt /> },
            { name: "Political Awareness", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Digital Dignity", path: "/quran/memorization", icon: <FaFileAlt /> },
          ],
        },
        {
          heading: "Muslim Identity Builder",
          links: [
            { name: "Mythbusters", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Faith & Doubt", path: "/quran/memorization", icon: <FaFileAlt /> },
            { name: "Being a Proud Muslim", path: "/quran/translations", icon: <FaFileAlt /> },
            { name: "Global Ummah Awareness", path: "/quran/memorization", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Ask & Debate",
      columns: [
        {
          heading: "Ask & Debate",
          links: [
            { name: "Ask a Scholar", path: "/hadith/bukhari", icon: <FaFileAlt /> },
            { name: "Debate Zone", path: "/hadith/muslim", icon: <FaFileAlt /> },
            { name: "AI Islamic Assistant", path: "/hadith/others", icon: <FaFileAlt /> },
            { name: "Public Q&A", path: "/hadith/others", icon: <FaFileAlt /> },
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
    {
      title: "Management",
      columns: [
        {
          heading: "Management",
          links: [
            { name: "AI Tools & Model Management", path: "/admin/settings", icon: <FaFileAlt /> },
            { name: "Language & Localization Management", path: "/admin/settings", icon: <FaFileAlt /> },
            { name: "Donation & Sponsorship Management", path: "/admin/settings", icon: <FaFileAlt /> },
            { name: "Moderation & Community Management", path: "/admin/settings", icon: <FaFileAlt /> },
            { name: "Notifications & Communication", path: "/admin/settings", icon: <FaFileAlt /> },
            { name: "Knowledge & Help Center Management", path: "/admin/settings", icon: <FaFileAlt /> },
          ],
        },
      ],
    },
    {
      title: "Analytics",
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
  
  SCHOLAR: [
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
