import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-green-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <main className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to SiratRevival</h1>
          <p className="text-lg">Your path to understanding Islam in every language.</p>
        </main>
      </div>
    </Layout>
  );
}
