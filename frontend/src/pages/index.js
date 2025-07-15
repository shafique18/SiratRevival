import React from 'react';
import Layout from '../components/layout/Layout';
import QuranVerseCard from '../screens/content/QuranVerseCard';
import HadithCard from '../screens/content/HadithCard';
import NewsFeed from '../screens/content/NewsFeed';
import TeamMemberCard from '../components/utils/TeamMemberCard';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function MainHome() {
  return (
    <Layout>
      <main className="pt-28 px-6 max-w-6xl mx-auto space-y-20 text-gray-900 dark:text-gray-100 font-sans">
        {/* 1. Quran - Left, Text - Right */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <QuranVerseCard />
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">About the Quran Verse</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover daily Quranic verses that inspire and guide. Each verse is thoughtfully selected to provide spiritual wisdom and encourage reflection.
            </p>
          </div>
        </section>

        {/* 2. Hadith - Right, Text - Left */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 order-2 md:order-1">
            <h3 className="text-2xl font-bold">About the Hadith</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn from the sayings of the Prophet Muhammad (PBUH). Each Hadith offers a timeless reminder for character building and faith.
            </p>
          </div>
          <HadithCard className="order-1 md:order-2" />
        </section>

        {/* 3. News - Left, Text - Right */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <NewsFeed />
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">About Islamic News</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay up to date with important news in the Muslim world. We bring curated, verified updates to keep you informed and engaged.
            </p>
          </div>
        </section>

        {/* 4. About Section */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center space-y-4">
          <h3 className="text-3xl font-bold">🕌 About This Application</h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Our app is dedicated to delivering Islamic knowledge in a modern and user-friendly way. Whether you're seeking spiritual guidance, staying updated with current events, or learning from Hadith and the Quran, this platform is your daily companion.
          </p>
        </section>

        {/* 5. Team Section */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center space-y-6">
          <h3 className="text-3xl font-bold">👥 Meet the Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Amina Khalid',
                role: 'UI/UX Designer',
                image: '/images/amina.jpg',
                description: 'Crafts delightful user experiences and sleek interfaces.',
                socialLinks: [
                  { platform: 'linkedin', url: 'https://linkedin.com/in/amina' },
                  { platform: 'twitter', url: 'https://twitter.com/amina' },
                ],
              },
              {
                name: 'Bilal Khan',
                role: 'Backend Developer',
                image: '/images/bilal.jpg',
                description: 'Ensures robust server-side logic and database integrity.',
                socialLinks: [
                  { platform: 'github', url: 'https://github.com/bilalkhan' },
                ],
              },
              {
                name: 'Fatima Noor',
                role: 'Frontend Developer',
                image: '/images/fatima.jpg',
                description: 'Builds interactive and responsive frontend components.',
                socialLinks: [
                  { platform: 'linkedin', url: 'https://linkedin.com/in/fatima' },
                  { platform: 'github', url: 'https://github.com/fatima' },
                ],
              },
              {
                name: 'Yusuf Rahman',
                role: 'Project Manager',
                image: '/images/yusuf.jpg',
                description: 'Keeps everything running smoothly and on schedule.',
                socialLinks: [
                  { platform: 'linkedin', url: 'https://linkedin.com/in/yusuf' },
                ],
              },
            ].map((member, idx) => (
              <TeamMemberCard key={idx} member={member} />
            ))}
          </div>
        </section>


        {/* 6. Donation Section */}
        <section className="bg-yellow-100 dark:bg-yellow-300/10 rounded-3xl shadow-lg p-8 text-center space-y-4">
          <h3 className="text-3xl font-bold text-yellow-700 dark:text-yellow-200">🤲 Support Our Work</h3>
          <p className="text-gray-700 dark:text-gray-100 max-w-xl mx-auto">
            Help us maintain and grow this project. Your donation supports server costs, new features, and better Islamic content for everyone.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition transform hover:scale-105">
            Donate Now
          </button>
        </section>
      </main>
    </Layout>
  );
}
