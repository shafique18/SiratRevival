import React from 'react';
import Layout from '../../components/layout/Layout';

const PurposeObjective = () => {
  return (
    <Layout>
    <section className="px-6 py-12 md:px-20 bg-gray-50">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Purpose & Objectives</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 max-w-4xl mx-auto">
        <li>Clarify Islamic principles with authenticity and relevance.</li>
        <li>Provide scholarly guidance for modern-day challenges.</li>
        <li>Promote thoughtful discourse and academic insight.</li>
      </ul>
    </section>
    </Layout>
  );
};

export default PurposeObjective;