import React from 'react';
import Layout from '../../components/Layout';
import PrayerTimesWidget from '../../components/PrayerTimesWidget';
import Sidebar from '../../components/Sidebar';
import ContentArea from '../../components/ContentArea';

export default function HomeAdult() {
  return (
    <Layout>
      <PrayerTimesWidget />
      <div className="flex flex-1">
        <Sidebar />
        <ContentArea />
      </div>
    </Layout>
  );
}
