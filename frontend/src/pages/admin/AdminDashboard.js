import React, { useEffect, useState, useContext, useRef } from "react";
import { Transition } from "@headlessui/react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Layout from "../../components/layout/Layout";

export default function AdminDashboard() {
  const { user, authTokens } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState({ message: "", type: "" });
  const toastTimeout = useRef(null);

  // Search & UI states
  const [search, setSearch] = useState("");
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectMessage, setRejectMessage] = useState("");
  const [viewMessage, setViewMessage] = useState(null);

  // Fetch users with optional query
  const fetchUsers = async (q = "") => {
    try {
      const res = await axios.get("http://localhost:8000/admin/users", {
        params: { q },
        headers: { Authorization: `Bearer ${authTokens.access_token}` },
      });
      setUsers(res.data);
    } catch (error) {
      showToast("Error fetching users", "error");
    }
  };

  // Fetch involvement requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/admin/involvement-requests",
        {
          headers: { Authorization: `Bearer ${authTokens.access_token}` },
        }
      );
      setRequests(res.data);
    } catch (error) {
      showToast("Error fetching involvement requests", "error");
    }
  };

  // Show toast helper with auto-hide
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 4000);
  };

  // Approve request handler
  const approveRequest = async (requestId) => {
    try {
      await axios.post(
        `http://localhost:8000/admin/approve/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authTokens.access_token}` },
        }
      );
      showToast("Request approved and user notified.");
      fetchRequests();
      fetchUsers();
    } catch (error) {
      showToast("Approval failed", "error");
    }
  };

  // Reject request handler (called after confirmation modal)
  const rejectRequest = async () => {
    if (!rejectRequestId) return;
    try {
      await axios.post(
        `http://localhost:8000/admin/reject/${rejectRequestId}`,
        { message: rejectMessage || "Your request was not approved." },
        {
          headers: { Authorization: `Bearer ${authTokens.access_token}` },
        }
      );
      showToast("Request rejected and user notified.");
      fetchRequests();
      setRejectRequestId(null);
      setRejectMessage("");
    } catch (error) {
      showToast("Rejection failed", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  // Stats computation
  const totalUsers = users.length;
  const contributorRoles = ["WRITER", "SCHOLAR", "REVIEWER"];
  const totalContributors = users.filter(
    (u) => u.isverified && u.roles.some((r) => contributorRoles.includes(r))
  ).length;
  const pendingContributors = users.filter(
    (u) => !u.isverified && u.roles.some((r) => contributorRoles.includes(r))
  ).length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 relative">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        {/* Toast Notification (top right corner, floating) */}
        <Transition
          show={!!toast.message}
          enter="transition duration-300 ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition duration-200 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="fixed top-5 right-5 z-50"
        >
          <div
            className={`px-6 py-3 rounded-lg shadow-lg max-w-xs text-white font-semibold ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {toast.message}
          </div>
        </Transition>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Total Users" value={totalUsers} />
          <StatCard label="Pending Contributors" value={pendingContributors} />
          <StatCard label="Total Contributors" value={totalContributors} />
        </div>

        {/* Search & Users */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t text-gray-700">
                  <td className="p-3">{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.roles.join(", ")}</td>
                  <td>
                    {u.isverified ? (
                      <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-xs">
                        Approved
                      </span>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        onClick={() => approveRequest(u.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Involvement Requests */}
        <div className="pt-10 border-t">
          <h2 className="text-2xl font-semibold mb-6">📬 Involvement Requests</h2>
          {requests.length === 0 ? (
            <div className="text-gray-400 italic text-center text-lg">
              🎉 No pending requests — all caught up!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req) => {
                const shortMessage =
                  req.message?.length > 100
                    ? req.message.slice(0, 100) + "..."
                    : req.message;

                return (
                  <div
                    key={req.id}
                    className="flex flex-col justify-between bg-white shadow-xl border border-gray-100 rounded-2xl p-6 min-h-[300px]"
                  >
                    <div className="space-y-2">
                      <p>
                        <strong>👤 User:</strong> {req.email}
                      </p>
                      <p>
                        <strong>🧩 Role:</strong>{" "}
                        <span className="text-blue-600 font-semibold">{req.role}</span>
                      </p>
                      <p>
                        <strong>📝 Message:</strong>{" "}
                        {req.message ? (
                          <>
                            {shortMessage}{" "}
                            {req.message.length > 100 && (
                              <button
                                onClick={() => setViewMessage(req)}
                                className="text-blue-600 underline text-sm ml-1"
                              >
                                Read more
                              </button>
                            )}
                          </>
                        ) : (
                          <em className="text-gray-400">No message</em>
                        )}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => approveRequest(req.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => {
                          setRejectRequestId(req.id);
                          setRejectMessage("");
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal for full message */}
        {viewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-lg max-w-xl w-full max-h-[80vh] flex flex-col"
            style={{ minHeight: '200px' }}
          >
            <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">📩 Full Message</h3>
              <button
                onClick={() => setViewMessage(null)}
                aria-label="Close modal"
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </header>
            <section
              className="px-6 py-4 overflow-y-auto text-gray-700 whitespace-pre-wrap"
              style={{ flexGrow: 1 }}
            >
              {viewMessage.message}
            </section>
            <footer className="px-6 py-3 border-t border-gray-200 text-right">
              <button
                onClick={() => setViewMessage(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

        {/* Modal for rejection confirmation */}
        {rejectRequestId !== null && (
          <Modal onClose={() => setRejectRequestId(null)} title="Reject Request">
            <p className="mb-4 text-gray-700">
              Please provide a reason for rejection:
            </p>
            <textarea
              rows={4}
              placeholder="Reason for rejection..."
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setRejectRequestId(null)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={rejectRequest}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                disabled={!rejectMessage.trim()}
                title={
                  !rejectMessage.trim()
                    ? "Please enter a rejection reason"
                    : "Reject request"
                }
              >
                Confirm Reject
              </button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

// Reusable Modal Component
function Modal({ children, title, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target.classList.contains("fixed")) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-lg relative">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Component for reusable stat cards
function StatCard({ label, value }) {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-white border border-blue-200 shadow-md rounded-2xl p-6 text-center space-y-2">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-blue-700">{value}</p>
    </div>
  );
}
