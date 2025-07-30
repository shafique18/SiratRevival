import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import avatar from "../../static/images/avatar.png";

const roleLabels = {
  SCHOLAR: 'Scholars',
  WRITER: 'Writers',
  REVIEWER: 'Reviewers',
};

const Contributors = () => {
  const [contributors, setContributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/users/contributors')
      .then(res => {
        setContributors(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch contributors error:', err);
        setLoading(false);
      });
  }, []);

  // Filter contributors by full name (first + middle + last)
  const filtered = contributors.filter(c => {
    const fullName = [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(' ');
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Group by user_role
  const grouped = filtered.reduce((acc, curr) => {
    const role = curr.user_role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(curr);
    return acc;
  }, {});

  return (
    <Layout>
      <section className="px-6 py-12 md:px-20 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Application Contributors
        </h2>

        <input
          type="text"
          placeholder="Search contributors by name..."
          className="w-full max-w-xl mx-auto block mb-12 px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {loading && <p className="text-center text-gray-500">Loading contributors...</p>}

        {!loading && Object.entries(grouped).map(([role, users]) => (
          <div key={role} className="mb-14">
            <h3 className="text-3xl font-semibold text-blue-700 mb-6 border-b-2 border-blue-700 pb-1">
              {roleLabels[role] || role}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {users.map((user) => {
                const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ');
                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
                  >
                    <img
                      src={user.profile_picture || avatar }
                      alt={fullName}
                      className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-blue-100"
                    />

                    <h4 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h4>

                    <p className="text-sm text-gray-600 italic mb-4">{user.user_role}</p>

                    <ul className="text-left text-gray-700 text-sm space-y-1 w-full max-w-xs">
                      <li><span className="font-semibold">Gender:</span> {user.gender || 'N/A'}</li>
                      <li><span className="font-semibold">Nationality:</span> {user.nationality || 'N/A'}</li>
                      <li><span className="font-semibold">Time Zone:</span> {user.time_zone || 'N/A'}</li>
                      <li><span className="font-semibold">Language Proficiency:</span> {user.language_proficiency || 'N/A'}</li>
                      <li><span className="font-semibold">Occupation:</span> {user.occupation || 'N/A'}</li>
                      <li><span className="font-semibold">Highest Qualification:</span> {user.highest_qualification || 'N/A'}</li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-12 text-lg">No contributors found.</p>
        )}
      </section>
    </Layout>
  );
};

export default Contributors;
