import React from 'react';
import Layout from '../components/layout/Layout';
import QuranVerseCard from '../screens/content/QuranVerseCard';
import HadithCard from '../screens/content/HadithCard';
import NewsFeed from '../screens/content/NewsFeed';

export default function MainHome() {
  return (
    <Layout>
      <div className="pt-28 px-4 space-y-8 max-w-7xl mx-auto bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <QuranVerseCard />
        <HadithCard />
        <NewsFeed />
      </div>
    </Layout>
  );
}
