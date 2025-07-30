import React from 'react';
import Layout from '../../components/layout/Layout';
const VisionMission = () => {
  return (
    <Layout>
    <section className="px-6 py-12 md:px-20">
      <div className="grid md:grid-cols-2 gap-10 text-gray-800">
        <div>
          <h3 className="text-2xl font-bold mb-3">Vision</h3>
          <p className="text-gray-700">
            To revive the intellectual and spiritual depth of Islamic thought in a rapidly evolving world.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">Mission</h3>
          <p className="text-gray-700">
            To foster a community of seekers, writers, scholars, and reviewers committed to authentic, accessible Islamic content.
          </p>
        </div>
      </div>
    </section>
    </Layout>
  );
};

export default VisionMission;