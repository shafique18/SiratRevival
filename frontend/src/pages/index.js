// src/pages/Index.js or src/pages/Home.js
import React from 'react';
import Layout from '../components/Layout';
import QuranVerseCard from '../screens/QuranVerseCard';
import HadithCard from '../screens/HadithCard';
import NewsFeed from '../screens/NewsFeed';

export default function Home() {
  return (
    <Layout>
      <div className="pt-28 px-4 space-y-8 max-w-7xl mx-auto">
        <QuranVerseCard />
        <HadithCard />
        <NewsFeed />
      </div>
    </Layout>
  );
}
