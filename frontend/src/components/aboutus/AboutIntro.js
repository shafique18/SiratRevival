import React from 'react';
import Layout from '../../components/layout/Layout';

const AboutIntro = () => {
  return (
   <Layout>
    <section className="px-6 py-12 md:px-20 text-center bg-white">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto">
        Sirat Revival is a knowledge-driven initiative aiming to reconnect contemporary minds with the essence of true Islamic teachings in a modern context.
      </p>
    </section>
     </Layout>
  );
};

export default AboutIntro;