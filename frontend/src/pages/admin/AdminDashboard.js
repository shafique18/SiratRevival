import React, { useEffect, useState, useContext } from 'react';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import AuthContext from "../../context/AuthContext";
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  const { user, authTokens } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [notify, setNotify] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async (q = '') => {
    if (!authTokens) {
      console.error("No auth token found. Please login.");
      return;
    }

    try {
      const res = await axios.get('http://localhost:8000/admin/users', {
        params: { q },
        headers: { Authorization: `Bearer ${authTokens.access_token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch users failed:", error);
      if (error.response?.status === 401) {
        setNotify("Unauthorized. Please login again.");
        logout();
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approve = async (id) => {
    if (!authTokens) return;

    try {
      await axios.post(`http://localhost:8000/admin/users/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${authTokens.access_token}` }
      });
      setNotify('User approved!');
      fetchUsers(search);
    } catch (error) {
      console.error("Approve failed:", error);
      if (error.response?.status === 401) {
        setNotify("Unauthorized. Please login again.");
        logout();
      }
    }
  };

  const [schedule, setSchedule] = useState({ title: '', content: '', visible_to: [] });
  const scheduleItem = async () => {
    if (!authTokens) return;

    try {
      await axios.post('http://localhost:8000/admin/schedule', schedule, {
        headers: { Authorization: `Bearer ${authTokens.access_token}` }
      });
      setNotify('Content scheduled!');
    } catch (error) {
      console.error("Schedule failed:", error);
      if (error.response?.status === 401) {
        setNotify("Unauthorized. Please login again.");
        logout();
      }
    }
  };

  return (
    <Layout>
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <Transition show={!!notify} className="mb-4" enter="transition-opacity duration-300"
                  enterFrom="opacity-0" enterTo="opacity-100">
        <div className="bg-green-100 text-green-800 py-2 px-4 rounded">{notify}</div>
      </Transition>

      {/* User Search & Table */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); fetchUsers(e.target.value); }}
          className="w-full p-2 border rounded"
        />
        <table className="w-full text-left border">
          <thead className="bg-gray-200"><tr>
            <th className="p-2">ID</th><th>Email</th><th>Roles</th><th>Approve</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td>{u.email}</td>
                <td>{u.roles.join(', ')}</td>
                <td>
                  {u.isverified ? (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded cursor-not-allowed"
                      disabled
                    >
                      Approved
                    </button>
                  ) : (
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => approve(u.id)}
                    >
                      Unapproved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scheduling Form */}
      <div className="border-t pt-6 space-y-4">
        <h2 className="text-xl font-semibold">Schedule Content</h2>
        <input type="text" placeholder="Title" value={schedule.title}
               onChange={(e) => setSchedule(s => ({...s, title: e.target.value}))}
               className="w-full p-2 border rounded"/>
        <textarea placeholder="Content" value={schedule.content}
               onChange={(e) => setSchedule(s => ({...s, content: e.target.value}))}
               className="w-full p-2 border rounded"/>
        <input type="text" placeholder="Visible to (comma separated age groups)"
               value={schedule.visible_to.join(',')}
               onChange={(e) => setSchedule(s => ({...s, visible_to: e.target.value.split(',').map(s=>s.trim())}))}
               className="w-full p-2 border rounded"/>
        <button onClick={scheduleItem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Schedule
        </button>
      </div>
    </div>
    </Layout>
  );
}
