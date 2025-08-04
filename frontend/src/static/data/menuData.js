// src/data/menuData.js
import { patch } from "@mui/material";
import { FaVideo,
  FaBook,
  FaBookOpen,
  FaPrayingHands,
  FaHandsWash,
  FaMosque,
  FaLanguage,
  FaMusic,
  FaPuzzlePiece,
  FaGamepad,
  FaPaintBrush,
  FaMicrophone,
  FaUserShield,
  FaFileDownload,
  FaLightbulb,
  FaChild,
  FaQuran,
  FaStarAndCrescent,
  FaFeatherAlt,
  FaShapes,
  FaSortNumericDown,
  FaHeadphones,
  FaFileAlt,
  FaHome,
  FaLock,
  FaStar, FaBrain, FaHandsHelping, FaTrophy, FaUserFriends, 
  FaUserGraduate, FaChalkboardTeacher, FaGlobe, FaHeart, FaQuestionCircle, 
  FaMicroscope, FaSmile, FaAppleAlt, FaDumbbell, FaRunning, FaBalanceScale, FaPeopleArrows,
  FaUsers,
  FaComments,
  FaRobot,
  FaMapMarkedAlt,
  FaFemale,
  FaPenNib,
  FaHeartbeat,
  FaSearch,
  FaHandshake,
  FaLaptop,
  FaMoneyBill,
  FaGavel,
  FaPeopleCarry,
  FaUserMd,
  FaChartLine,
  FaFistRaised,
  FaRegLightbulb,
  FaNotesMedical,
  FaLeaf,
  FaUserNurse,
  FaCalendarCheck,
  FaFolderOpen,
  FaPenFancy,
  FaCogs,
  FaBell,
  FaChartBar,
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
  FaRegNewspaper,
  FaPlayCircle,
  FaLink,
  FaPray,
  FaCamera,
  FaEye,
  FaKaaba,
 } from "react-icons/fa";

const BASE = [
  {
    title: "Quran & Hadith",
    columns: [
      {
        heading: "Quran",
        links: [
          { name: "Tafsir Explorer", path: "/quran/tafsir", icon: <FaBookOpen /> },
          { name: "Thematic Quran Reading", path: "/quran/themes", icon: <FaQuran /> },
          { name: "Quranic Revelations", path: "/quran/revelations", icon: <FaBook /> },
          { name: "Practical Quran", path: "/quran/practical", icon: <FaSearch /> },
        ],
      },
      {
        heading: "Hadith",
        links: [
          { name: "Hadith Collections", path: "/hadith/collections", icon: <FaBook /> },
          { name: "Hadith by Themes", path: "/hadith/themes", icon: <FaSearch /> },
          {
            name: "Understanding Usul al-Tafsir & Hadith",
            path: "/hadith/usul",
            icon: <FaFeatherAlt />,
          },
        ],
      },
    ],
  },
  {
    title: "Fiqh",
    columns: [
      {
        heading: "Fiqh of Everyday Life",
        links: [
          { name: "Fiqh of Family Life", path: "/fiqh/family", icon: <FaUsers /> },
          { name: "Fiqh of Finance", path: "/fiqh/finance", icon: <FaMoneyBill /> },
          { name: "Workplace & Career", path: "/fiqh/career", icon: <FaLaptop /> },
          {
            name: "Marital Guidance & Conflict Resolution",
            path: "/fiqh/marriage",
            icon: <FaHandshake />,
          },
          { name: "Wills & Inheritance (Mirath)", path: "/fiqh/inheritance", icon: <FaGavel /> },
          { name: "Fiqh by Madhab (Optional)", path: "/fiqh/madhab", icon: <FaBalanceScale /> },
        ],
      },
    ],
  },
  {
    title: "Seerah & History",
    columns: [
      {
        heading: "Seerah & Historical Lessons",
        links: [
          { name: "Seerah Timeline", path: "/history/seerah-timeline", icon: <FaCalendarCheck /> },
          { name: "Spread of Islam", path: "/history/spread-of-islam", icon: <FaGlobe /> },
          { name: "Key Battles & Lessons", path: "/history/battles", icon: <FaFistRaised /> },
          { name: "Golden Age of Islam", path: "/history/golden-age", icon: <FaRegLightbulb /> },
          { name: "Rise & Fall of Empires", path: "/history/empires", icon: <FaChartLine /> },
          { name: "Sahaba Spotlight", path: "/history/sahaba", icon: <FaUserGraduate /> },
          { name: "Women in History", path: "/history/women", icon: <FaUserNurse /> },
        ],
      },
    ],
  },
  {
    title: "Parenting",
    columns: [
      {
        heading: "Parenting with Prophetic Wisdom",
        links: [
          { name: "Stages of Parenting", path: "/parenting/stages", icon: <FaUsers /> },
          { name: "Prophetic Methods", path: "/parenting/prophetic", icon: <FaPrayingHands /> },
          { name: "Modern Challenges", path: "/parenting/challenges", icon: <FaBrain /> },
          { name: "Spiritual Parenting", path: "/parenting/spiritual", icon: <FaHeart /> },
          { name: "Tips from Scholars", path: "/parenting/tips", icon: <FaChalkboardTeacher /> },
        ],
      },
    ],
  },
  {
    title: "Economics & Politics",
    columns: [
      {
        heading: "Islamic Economics & Politics",
        links: [
          { name: "Halal Economy Principles", path: "/economics/halal", icon: <FaMoneyBill /> },
          {
            name: "Social Welfare Models in Islam",
            path: "/economics/welfare",
            icon: <FaHandsHelping />,
          },
          {
            name: "Politics in Islamic Thought",
            path: "/politics/islamic-thought",
            icon: <FaBalanceScale />,
          },
          { name: "Modern Muslim World", path: "/politics/modern", icon: <FaGlobe /> },
          { name: "Ethical Leadership", path: "/politics/leadership", icon: <FaRegLightbulb /> },
        ],
      },
    ],
  },
  {
    title: "Scholars Corner",
    columns: [
      {
        heading: "Scholars Corner",
        links: [
          { name: "Video Series by Category", path: "/scholars/videos", icon: <FaFolderOpen /> },
          { name: "Islamic Papers & Research", path: "/scholars/research", icon: <FaPenFancy /> },
          { name: "Weekly Scholar Picks", path: "/scholars/picks", icon: <FaRegLightbulb /> },
          { name: "Ask a Scholar (Live/Recorded)", path: "/scholars/ask", icon: <FaComments /> },
        ],
      },
      {
        heading: "AI Assistant",
        links: [
          { name: "Ask Any Question", path: "/ai/ask", icon: <FaComments /> },
          {
            name: "Compare Schools of Thought",
            path: "/ai/compare",
            icon: <FaBalanceScale />,
          },
          { name: "Verified Knowledgebase", path: "/ai/knowledgebase", icon: <FaBook /> },
        ],
      },
    ],
  },
  {
    title: "Contribute",
    columns: [
      {
        heading: "Join the Revival (Contribute)",
        links: [
          { name: "Content Writing Hub", path: "/contribute/writing", icon: <FaPenFancy /> },
          { name: "Translation & Proofreading", path: "/contribute/translation", icon: <FaFeatherAlt /> },
          {
            name: "Course Reviewer Role",
            path: "/contribute/review",
            icon: <FaChalkboardTeacher />,
          },
          { name: "Mentor a Youth", path: "/contribute/mentorship", icon: <FaUserFriends /> },
        ],
      },
    ],
  },
  {
    title: "Community",
    columns: [
      {
        heading: "Community Learning Circles",
        links: [
          { name: "Weekly Tafsir", path: "/community/tafsir", icon: <FaBookOpen /> },
          {
            name: "Sisters and Brothers Study Circles",
            path: "/community/study-circles",
            icon: <FaUserFriends />,
          },
          { name: "Annual Challenges", path: "/community/challenges", icon: <FaChartLine /> },
          { name: "Book Clubs", path: "/community/book-clubs", icon: <FaBook /> },
        ],
      },
    ],
  },
  {
    title: "Learning",
    columns: [
      {
        heading: "Advanced Learning & Islamic Essentials",
        links: [
          { name: "Advanced Arabic for Adults", path: "/learning/arabic", icon: <FaQuran /> },
          { name: "Refined English for Dawah", path: "/learning/english", icon: <FaBookOpen /> },
          { name: "Day-to-Day Islamic Etiquettes", path: "/learning/etiquettes", icon: <FaPrayingHands /> },
          { name: "Societal Manners", path: "/learning/manners", icon: <FaUsers /> },
          { name: "Role of Muslims in a Country", path: "/learning/citizenship", icon: <FaGlobe /> },
          {
            name: "Understanding Hajj, Umrah, Qurbani",
            path: "/learning/pillars",
            icon: <FaFeatherAlt />,
          },
          {
            name: "Spiritual Cleanliness & Rituals",
            path: "/learning/cleanliness",
            icon: <FaNotesMedical />,
          },
        ],
      },
      {
        heading: "Quran Deep Learning & Dua Bank",
        links: [
          {
            name: "Advanced Memorization Plan",
            path: "/quran/memorization",
            icon: <FaQuran />,
          },
          {
            name: "Thematic Quran Series",
            path: "/quran/themes-series",
            icon: <FaBookOpen />,
          },
          { name: "Living the Quran", path: "/quran/living", icon: <FaHeart /> },
          {
            name: "Dua Library with Meaning",
            path: "/dua/library",
            icon: <FaPrayingHands />,
          },
          {
            name: "Dua Memorization System",
            path: "/dua/memorize",
            icon: <FaBook />,
          },
        ],
      },
      {
        heading: "Physical & Emotional Wellness (Sunnah-Centric)",
        links: [
          { name: "Prophetic Fitness", path: "/wellness/fitness", icon: <FaRunning /> },
          { name: "Sports by Region & Gender", path: "/wellness/sports", icon: <FaUsers /> },
          { name: "Mens Health & Energy", path: "/wellness/mens-health", icon: <FaUserMd /> },
          { name: "Womens Wellness", path: "/wellness/womens-health", icon: <FaUserNurse /> },
          {
            name: "Mental Strength & Resilience",
            path: "/wellness/mental",
            icon: <FaBrain />,
          },
          {
            name: "Sleep, Nutrition, Habits",
            path: "/wellness/lifestyle",
            icon: <FaLeaf />,
          },
        ],
      },
    ],
  },
  {
    title: "Womens Lounge",
    columns: [
      {
        heading: "Womens Lounge (For Sisters Only)",
        links: [
          { name: "Cycle Awareness", path: "/women/cycle", icon: <FaNotesMedical /> },
          { name: "Hygiene & Worship", path: "/women/hygiene", icon: <FaPrayingHands /> },
          {
            name: "Spiritual Growth as a Woman",
            path: "/women/spirituality",
            icon: <FaHeart />,
          },
          {
            name: "Muslim Women Role Models",
            path: "/women/role-models",
            icon: <FaUserGraduate />,
          },
          {
            name: "Career, Identity, and Modesty",
            path: "/women/identity",
            icon: <FaUsers />,
          },
        ],
      },
    ],
  },
];

const menuData = {
  GROUP_0_5: [
    { title: "Home", path: "/home", icon: <FaVideo /> },
    {
      title: "My First Islam",
      columns: [
        {
          heading: "My First Islam",
          links: [
            { name: "Allah", path: "/stories/shorts", icon: <FaPray /> },
            { name: "Prophet Muhammad (PBUH)", path: "/stories/quran", icon: <FaSmile /> },
            { name: "Angels", path: "/stories/hadith", icon: <FaCamera /> },
            { name: "Pillars of Islam", path: "/stories/sahaba", icon: <FaKaaba /> },
            { name: "Day-to-Day Etiquettes", path: "/stories/hadith", icon: <FaEye /> },
            { name: "Good Behaviour", path: "/stories/sahaba", icon: <FaBook /> },
          ],
        },
      ],
    },
    {
      title: "Stories",
      columns: [
        {
          heading: "Stories",
          links: [
            { name: "Shorts", path: "/stories/shorts", icon: <FaBook /> },
            { name: "Quran", path: "/stories/quran", icon: <FaQuran /> },
            { name: "Hadith", path: "/stories/hadith", icon: <FaBookOpen /> },
            { name: "Sahaba", path: "/stories/sahaba", icon: <FaBook /> },
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
            { name: "Basic Duas", path: "/duas/basic", icon: <FaPrayingHands /> },
            { name: "Dua Cards", path: "/duas/cards", icon: <FaFileDownload /> },
          ],
        },
        {
          heading: "Prayer Times",
          links: [
            { name: "Wudu", path: "/prayers/wudu", icon: <FaHandsWash /> },
            { name: "Prayers", path: "/prayers/times", icon: <FaMosque /> },
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
            { name: "Alphabet & Sounds", path: "/language/arabic/alphabet", icon: <FaLanguage /> },
            { name: "Basic Words", path: "/language/arabic/words", icon: <FaLanguage /> },
            { name: "Colours & Shapes", path: "/language/arabic/colors-shapes", icon: <FaShapes /> },
            { name: "Numbers & Counting", path: "/language/arabic/numbers", icon: <FaSortNumericDown /> },
          ],
        },
        {
          heading: "English",
          links: [
            { name: "Alphabet & Sounds", path: "/language/english/alphabet", icon: <FaLanguage /> },
            { name: "Basic Words", path: "/language/english/words", icon: <FaLanguage /> },
            { name: "Colours & Shapes", path: "/language/english/colors-shapes", icon: <FaShapes /> },
            { name: "Numbers & Counting", path: "/language/english/numbers", icon: <FaSortNumericDown /> },
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
            { name: "Rhymes & Nasheeds", path: "/songs/nasheeds", icon: <FaMusic /> },
            { name: "Quranic Verses", path: "/songs/quranic-verses", icon: <FaHeadphones /> },
            { name: "Poems", path: "/songs/poems", icon: <FaFeatherAlt /> },
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
            { name: "Touch & Learn", path: "/games/touch-learn", icon: <FaChild /> },
            { name: "Match the Pairs", path: "/games/match-pairs", icon: <FaPuzzlePiece /> },
            { name: "Colouring Pages", path: "/games/coloring", icon: <FaPaintBrush /> },
            { name: "Puzzle Time", path: "/games/puzzles", icon: <FaGamepad /> },
            { name: "Voice & Repeat", path: "/games/voice-repeat", icon: <FaMicrophone /> },
          ],
        },
        {
          heading: "Islamic Identifiers",
          links: [
            { name: "Masjid & Prayer Mats", path: "/identifiers/masjid-mats", icon: <FaMosque /> },
            { name: "Hijab & Modesty", path: "/identifiers/hijab", icon: <FaStarAndCrescent /> },
            { name: "Islamic Festivals", path: "/identifiers/festivals", icon: <FaStarAndCrescent /> },
            { name: "Animals in Islam", path: "/identifiers/animals", icon: <FaBookOpen /> },
            { name: "Islamic Objects", path: "/identifiers/objects", icon: <FaBook /> },
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
            { name: "Progress Reports", path: "/parents/progress", icon: <FaLightbulb /> },
            { name: "Recommended Content", path: "/parents/recommended", icon: <FaStarAndCrescent /> },
            { name: "Parental Controls", path: "/parents/controls", icon: <FaUserShield /> },
            { name: "Tips for Parents", path: "/parents/tips", icon: <FaBookOpen /> },
            { name: "Downloadable Resources", path: "/parents/downloads", icon: <FaFileDownload /> },
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
            { name: "Five Pillars of Islam", path: "/islam/five-pillars", icon: <FaStar /> },
            { name: "Prophets of Islam", path: "/islam/prophets", icon: <FaBookOpen /> },
            { name: "Daily Practices & Worship", path: "/islam/worship", icon: <FaPrayingHands /> },
            { name: "Islamic Beliefs & Creed (Aqidah)", path: "/islam/aqidah", icon: <FaBrain /> },
            { name: "Moral & Ethical Teachings", path: "/islam/morals", icon: <FaHeart /> },
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
            { name: "Verses & Stories", path: "/quran/stories", icon: <FaBookOpen /> },
            { name: "Memorization", path: "/quran/memorization", icon: <FaUserGraduate /> },
            { name: "Contextual Understanding", path: "/quran/context", icon: <FaMicroscope /> },
            { name: "Quran & Science", path: "/quran/science", icon: <FaGlobe /> },
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
            { name: "Word Games & Crosswords", path: "/games/words", icon: <FaGamepad /> },
            { name: "Fiqh Activities", path: "/games/fiqh", icon: <FaBrain /> },
            { name: "Moral Dilemma", path: "/games/ethics", icon: <FaBalanceScale /> },
            { name: "Reward System", path: "/games/rewards", icon: <FaTrophy /> },
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
            { name: "Prophet", path: "/stories/prophets", icon: <FaBookOpen /> },
            { name: "Sahaba & Women in Islam", path: "/stories/sahaba", icon: <FaUserFriends /> },
            { name: "Quran", path: "/stories/quran", icon: <FaBookOpen /> },
            { name: "Historical Episodes", path: "/stories/history", icon: <FaFeatherAlt /> },
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
            { name: "Habit Tracker", path: "/daily/habits", icon: <FaStar /> },
            { name: "Reflection Journal", path: "/daily/journal", icon: <FaFileAlt /> },
            { name: "Goal Setting", path: "/daily/goals", icon: <FaTrophy /> },
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
            { name: "Vocabulary Builder", path: "/language/arabic/vocabulary", icon: <FaBookOpen /> },
            { name: "Grammar & Sentence Building", path: "/language/arabic/grammar", icon: <FaChalkboardTeacher /> },
            { name: "Reading Practice", path: "/language/arabic/reading", icon: <FaBookOpen /> },
            { name: "Writing Practice", path: "/language/arabic/writing", icon: <FaFeatherAlt /> },
          ],
        },
        {
          heading: "English",
          links: [
            { name: "Vocabulary Builder", path: "/language/english/vocabulary", icon: <FaBookOpen /> },
            { name: "Grammar & Sentence Building", path: "/language/english/grammar", icon: <FaChalkboardTeacher /> },
            { name: "Reading Practice", path: "/language/english/reading", icon: <FaBookOpen /> },
            { name: "Writing Practice", path: "/language/english/writing", icon: <FaFeatherAlt /> },
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
            { name: "AI Scholar", path: "/ask/ai-scholar", icon: <FaBrain /> },
            { name: "Submit Questions", path: "/ask/submit", icon: <FaQuestionCircle /> },
            { name: "Video Answers", path: "/ask/videos", icon: <FaFileAlt /> },
            { name: "FAQ", path: "/ask/faq", icon: <FaQuestionCircle /> },
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
            { name: "Islam & Family", path: "/forme/family", icon: <FaUserFriends /> },
            { name: "Friends & Community", path: "/forme/community", icon: <FaHandsHelping /> },
            { name: "Society & Respect", path: "/forme/society", icon: <FaGlobe /> },
            { name: "Women in Islam", path: "/forme/women", icon: <FaUserFriends /> },
            { name: "Interfaith Harmony", path: "/forme/interfaith", icon: <FaPeopleArrows /> },
            { name: "Environmental Stewardship", path: "/forme/environment", icon: <FaGlobe /> },
          ],
        },
        {
          heading: "Etiquettes & Good Behaviour",
          links: [
            { name: "Day-to-Day Etiquettes", path: "/forme/etiquette", icon: <FaSmile /> },
            { name: "Social Behaviour", path: "/forme/social", icon: <FaUserFriends /> },
            { name: "Digital Etiquette", path: "/forme/digital", icon: <FaGlobe /> },
            { name: "Conflict Resolution", path: "/forme/conflict", icon: <FaBalanceScale /> },
          ],
        },
        {
          heading: "Duas & Memorization",
          links: [
            { name: "Basic to Advanced Duas", path: "/forme/duas", icon: <FaPrayingHands /> },
            { name: "Audio Repetition Tools", path: "/forme/audio-tools", icon: <FaFileAlt /> },
            { name: "Daily Du’a Challenge", path: "/forme/dua-challenge", icon: <FaStar /> },
            { name: "Quran Memorization Section", path: "/forme/quran-memorization", icon: <FaBookOpen /> },
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
            { name: "Why Fitness Matters", path: "/fitness/importance", icon: <FaAppleAlt /> },
            { name: "Prophets Fitness Habits", path: "/fitness/prophet-habits", icon: <FaRunning /> },
            { name: "Simple Exercises & Games", path: "/fitness/exercises", icon: <FaDumbbell /> },
            { name: "Mind & Body Balance", path: "/fitness/balance", icon: <FaBalanceScale /> },
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
            { name: "Progress Reports", path: "/parents/progress", icon: <FaStar /> },
            { name: "Recommended Content", path: "/parents/content", icon: <FaBookOpen /> },
            { name: "Tips", path: "/parents/tips", icon: <FaLightbulb /> },
            { name: "Resources for Family Discussions", path: "/parents/resources", icon: <FaUserFriends /> },
            { name: "Parental Controls", path: "/parents/controls", icon: <FaLock /> },
            { name: "Downloadable Resources", path: "/parents/downloads", icon: <FaFileDownload /> },
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
          heading: "Quran & Sunnah",
          links: [
            { name: "Thematic Tafsir", path: "/deep-dive/thematic-tafsir", icon: <FaBookOpen /> },
            { name: "Surah Dissections", path: "/deep-dive/surah-dissections", icon: <FaBook /> },
            { name: "Advanced Hadith Studies", path: "/deep-dive/advanced-hadith", icon: <FaMicroscope /> },
            { name: "Usul al-Hadith", path: "/deep-dive/usul-hadith", icon: <FaBookOpen /> },
            { name: "Sunnah in Today’s World", path: "/deep-dive/sunnah-modern", icon: <FaHandsHelping /> },
            { name: "Prayers", path: "/deep-dive/prayers", icon: <FaBookOpen /> },
          ],
        },
        {
          heading: "Islam & Real Life",
          links: [
            { name: "Islam & Career Choices", path: "/real-life/career", icon: <FaBrain /> },
            { name: "Mental Health & Islam", path: "/real-life/mental-health", icon: <FaHeartbeat /> },
            { name: "Relationships & Boundaries", path: "/real-life/relationships", icon: <FaUserFriends /> },
            { name: "Social Justice", path: "/real-life/social-justice", icon: <FaGlobe /> },
            { name: "Political Awareness", path: "/real-life/politics", icon: <FaGlobe /> },
            { name: "Digital Dignity", path: "/real-life/digital-dignity", icon: <FaRobot /> },
          ],
        },
        {
          heading: "Muslim Identity Builder",
          links: [
            { name: "MythBusters", path: "/identity/mythbusters", icon: <FaQuestionCircle /> },
            { name: "Faith & Doubt", path: "/identity/faith-doubt", icon: <FaBrain /> },
            { name: "Being a Proud Muslim", path: "/identity/proud-muslim", icon: <FaSmile /> },
            { name: "Global Ummah Awareness", path: "/identity/global-ummah", icon: <FaGlobe /> },
          ],
        },
        {
          heading: "Advanced Quran & Dua Section",
          links: [
            { name: "Memorization", path: "/quran/memorization", icon: <FaBookOpen /> },
            { name: "Detailed Duas", path: "/quran/duas", icon: <FaHeart /> },
            { name: "Dua Challenge", path: "/quran/dua-challenge", icon: <FaBrain /> },
            { name: "Dua Reflection", path: "/quran/dua-reflection", icon: <FaBook /> },
          ],
        },
        {
          heading: "Islam & Society",
          links: [
            { name: "Family & Marriage", path: "/society/family-marriage", icon: <FaUsers /> },
            { name: "Friendship & Loyalty", path: "/society/friendship", icon: <FaUserFriends /> },
            { name: "Community Engagement", path: "/society/community", icon: <FaHandsHelping /> },
            { name: "Respecting Elders & Teachers", path: "/society/respect", icon: <FaChalkboardTeacher /> },
            { name: "Non-Muslim Relations", path: "/society/non-muslim-relations", icon: <FaUsers /> },
            { name: "Beauty of Manners", path: "/society/manners", icon: <FaSmile /> },
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
            { name: "Ask a Scholar", path: "/ask-debate/ask-scholar", icon: <FaQuestionCircle /> },
            { name: "Debate Zone", path: "/ask-debate/debate-zone", icon: <FaComments /> },
            { name: "Public Q&A", path: "/ask-debate/public-qa", icon: <FaComments /> },
          ],
        },
        {
          heading: "AI",
          links: [
            { name: "AI Islamic Assistant", path: "/ask-debate/ai-assistant", icon: <FaRobot /> },
            { name: "Doubt Resolver Bot", path: "/ask-debate/doubt-bot", icon: <FaRobot /> },
            { name: "Exams & Prep", path: "/ask-debate/exams-prep", icon: <FaBook /> },
            { name: "Topic Agent", path: "/ask-debate/topic-agent", icon: <FaRobot /> },
          ],
        },
      ],
    },
    {
      title: "Islamic History",
      columns: [
        {
          heading: "Islamic History",
          links: [
            { name: "Pre-Islamic Arabia", path: "/history/pre-islamic-arabia", icon: <FaMapMarkedAlt /> },
            { name: "Seerah Chronicles", path: "/history/seerah", icon: <FaBook /> },
            { name: "Sahabas Unfiltered", path: "/history/sahabas", icon: <FaUsers /> },
            { name: "Women in Islam", path: "/history/women", icon: <FaFemale /> },
            { name: "Khilafah Era & Beyond", path: "/history/khilafah", icon: <FaGlobe /> },
            { name: "Interactive Timelines & Maps", path: "/history/timelines", icon: <FaMapMarkedAlt /> },
            { name: "Historical Controversies", path: "/history/controversies", icon: <FaQuestionCircle /> },
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
            { name: "Grammar", path: "/language/arabic/grammar", icon: <FaPenNib /> },
            { name: "Vocabulary", path: "/language/arabic/vocab", icon: <FaBook /> },
            { name: "Reading", path: "/language/arabic/reading", icon: <FaBookOpen /> },
            { name: "Writing", path: "/language/arabic/writing", icon: <FaPenNib /> },
            { name: "Conversation", path: "/language/arabic/conversation", icon: <FaComments /> },
          ],
        },
        {
          heading: "English",
          links: [
            { name: "Grammar", path: "/language/english/grammar", icon: <FaPenNib /> },
            { name: "Vocabulary", path: "/language/english/vocab", icon: <FaBook /> },
            { name: "Reading", path: "/language/english/reading", icon: <FaBookOpen /> },
            { name: "Writing", path: "/language/english/writing", icon: <FaPenNib /> },
            { name: "Conversation", path: "/language/english/conversation", icon: <FaComments /> },
          ],
        },
      ],
    },
    {
      title: "Skill Up",
      columns: [
        {
          heading: "Skill Up",
          links: [
            { name: "Islamic Writing", path: "/skillup/writing", icon: <FaPenNib /> },
            { name: "Graphic Design", path: "/skillup/design", icon: <FaBrain /> },
            { name: "Video Creation & Reels", path: "/skillup/video", icon: <FaMicrophone /> },
            { name: "Public Speaking/Dawah", path: "/skillup/speaking", icon: <FaMicrophone /> },
            { name: "Podcast Starter Guide", path: "/skillup/podcast", icon: <FaMicrophone /> },
          ],
        },
        {
          heading: "Path",
          links: [
            { name: "Levels of Faith Tracker", path: "/path/faith-tracker", icon: <FaBook /> },
            { name: "Badges & Leaderboards", path: "/path/badges", icon: <FaUsers /> },
            { name: "Team Challenges", path: "/path/challenges", icon: <FaHandsHelping /> },
            { name: "Monthly Goals & Journals", path: "/path/goals-journals", icon: <FaBookOpen /> },
          ],
        },
      ],
    },
    {
      title: "Fitness",
      columns: [
        {
          heading: "Physical Fitness & Prophetic Lifestyle",
          links: [
            { name: "Fitness in the Sunnah", path: "/fitness/sunnah", icon: <FaDumbbell /> },
            { name: "Nutrition & Health", path: "/fitness/nutrition", icon: <FaHeartbeat /> },
            { name: "Workout with Intention", path: "/fitness/workout", icon: <FaRunning /> },
            { name: "Mental Strength & Resilience", path: "/fitness/mental", icon: <FaBrain /> },
            { name: "Women Fitness", path: "/fitness/women", icon: <FaFemale /> },
          ],
        },
      ],
    },
    {
      title: "Girls' Lounge",
      columns: [
        {
          heading: "Girls' Lounge - Safe space for young Muslimahs",
          links: [
            { name: "Understanding the Menstrual Cycle", path: "/girls/menstrual", icon: <FaFemale /> },
            { name: "Puberty & Changes", path: "/girls/puberty", icon: <FaBrain /> },
            { name: "Confidence & Modesty", path: "/girls/confidence", icon: <FaSmile /> },
            { name: "Women Rights in Islam", path: "/girls/women-rights", icon: <FaHandsHelping /> },
            { name: "Role Models in History", path: "/girls/role-models", icon: <FaUsers /> },
            { name: "Mental Health for Girls", path: "/girls/mental-health", icon: <FaHeartbeat /> },
            { name: "FAQs Only for Girls", path: "/girls/faqs", icon: <FaQuestionCircle /> },
          ],
        },
      ],
    },
  ],

  GROUP_26_PLUS: [
    ...BASE
  ],

  ADMIN: [
    {
      title: "Users",
      path: "/admin",
      icon: <FaUsers />,
    },
    {
      title: "Content",
      columns: [
        {
          heading: "Content",
          links: [
            {
              name: "By Creator",
              path: "/admin/content/by-creator",
              icon: <FaFolderOpen />,
            },
            {
              name: "Application",
              path: "/admin/content/applications",
              icon: <FaCogs />,
            },
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
            {
              name: "AI Tools & Model Management",
              path: "/admin/management/ai-tools",
              icon: <FaTools />,
            },
            {
              name: "Language & Localization Management",
              path: "/admin/management/localization",
              icon: <FaGlobe />,
            },
            {
              name: "Donation & Sponsorship Management",
              path: "/admin/management/donations",
              icon: <FaHandsHelping />,
            },
            {
              name: "Moderation & Community Management",
              path: "/admin/management/moderation",
              icon: <FaComments />,
            },
            {
              name: "Notifications & Communication",
              path: "/admin/management/notifications",
              icon: <FaBell />,
            },
            {
              name: "Knowledge & Help Center Management",
              path: "/admin/management/help-center",
              icon: <FaBook />,
            },
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
            {
              name: "View Usage Statistics",
              path: "/admin/analytics/usage",
              icon: <FaChartBar />,
            },
            {
              name: "Download or Schedule Reports",
              path: "/admin/analytics/reports",
              icon: <FaFileDownload />,
            },
          ],
        },
      ],
    },
  ],

  WRITER: [
    ...BASE,
    {
      title: "My Content",
      columns: [
        {
          heading: "My Content Dashboard",
          links: [
            { name: "Drafts", path: "/writer/drafts", icon: <FaFileAlt /> },
            { name: "Submitted", path: "/writer/submitted", icon: <FaCheckCircle /> },
            { name: "Rejected", path: "/writer/rejected", icon: <FaTimesCircle /> },
          ],
        },
      ],
    },
  ],

  REVIEWER: [
    ...BASE,
    {
      title: "Dashboard",
      columns: [
        {
          heading: "Review Tasks",
          links: [
            { name: "Pending", path: "/reviewer/pending", icon: <FaFileAlt /> },
            { name: "Rate Quality", path: "/reviewer/rate-quality", icon: <FaCheckCircle /> },
            { name: "AI Assistant", path: "/reviewer/ai-assistant", icon: <FaRobot /> },
            { name: "Error", path: "/reviewer/errors", icon: <FaTimesCircle /> },
            { name: "Fact-Checking", path: "/reviewer/fact-checking", icon: <FaRegNewspaper /> },
          ],
        },
      ],
    },
  ],

  SCHOLAR: [
    ...BASE,
    {
      title: "Scholar Dashboard",
      columns: [
        {
          heading: "Submit",
          links: [
            { name: "Fatwas", path: "/scholar/fatwas", icon: <FaFileAlt /> },
            { name: "Tafsir Notes", path: "/scholar/tafsir-notes", icon: <FaRegNewspaper /> },
            { name: "Hadith Clarification", path: "/scholar/hadith-clarification", icon: <FaRegNewspaper /> },
            { name: "Articles", path: "/scholar/articles", icon: <FaRegNewspaper /> },
            { name: "Lectures", path: "/scholar/lectures", icon: <FaPlayCircle /> },
          ],
        },
        {
          heading: "Link",
          links: [
            { name: "Usul al-Fiqh", path: "/scholar/usul-al-fiqh", icon: <FaLink /> },
            { name: "Qawaid", path: "/scholar/qawaid", icon: <FaLink /> },
            { name: "References", path: "/scholar/references", icon: <FaLink /> },
          ],
        },
      ],
    },
  ],

  GUEST: [
    { title: "Home", path: "/", icon: <FaHome /> },
    {
      title: "About us",
      columns: [
        {
          heading: "About us",
          links: [
            { name: "Introduction", path: "/aboutus#intro", icon: <FaFileAlt /> },
            { name: "Purpose & Objective", path: "/aboutus#purpose-objective", icon: <FaFileAlt /> },
            { name: "Vision & Mission", path: "/aboutus#vision-mission", icon: <FaFileAlt /> },
            { name: "Why is the Sirat Revival?", path: "/aboutus#why-sirat-revival", icon: <FaFileAlt /> },
            { name: "Contributors", path: "/aboutus#contributors", icon: <FaFileAlt /> },
          ],
        },
      ],
      path:"/aboutus#intro",
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
            { name: "Contributor", path: "/get-involved#contributor", icon: <FaFileAlt /> },
            { name: "Partner", path: "/get-involved#partner", icon: <FaFileAlt /> },
            { name: "Tech-Savvy", path: "/get-involved#tech-savvy", icon: <FaFileAlt /> },
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
            { name: "Global Islamic News", path: "/content/GlobalIslamicNews", icon: <FaFileAlt /> },
            { name: "Sirat Revival Platform Updates", path: "/articles/history", icon: <FaFileAlt /> },
            { name: "New Content Releases", path: "/articles/history", icon: <FaFileAlt /> },
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
              { name: "General", path: "/contactus#general", icon: "📄" },
              { name: "Feedback", path: "/contactus#feedback", icon: "✉️" },
              { name: "Suggestions", path: "/contactus#suggestions", icon: "💡" },
              { name: "Report", path: "/contactus#report", icon: "⚠️" },
              { name: "FAQs", path: "/contactus#faqs", icon: "❓" },
          ],
        },
      ],
    },
  ],
};

export default menuData;
