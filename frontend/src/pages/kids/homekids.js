import React from 'react';
import Layout from '../../components/Layout';
import PrayerTimesWidget from '../../components/PrayerTimesWidget';

export default function HomeKids() {
  return (
    <Layout>
      <PrayerTimesWidget />
      <div className="flex flex-1">
      </div>
    </Layout>
  );
}
