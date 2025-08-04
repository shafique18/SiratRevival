import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios";

interface Request {
  id: number;
  user: { id: number; username: string; email: string };
  role: string;
  message: string;
  is_approved: boolean;
}

const InvolvementRequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/admin/involvement-requests");
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmApprove = (id) => {
    setSelectedRequestId(id);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (selectedRequestId === null) return;
    try {
      await axios.post(`/api/admin/approve/${selectedRequestId}`);
      fetchRequests();
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      setShowModal(false);
      setSelectedRequestId(null);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Involvement Requests</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {requests.filter(r => !r.is_approved).map((req) => (
              <div key={req.id} className="p-4 border border-gray-300 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {req.user.username} ({req.user.email})
                  </span>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                    Role: {req.role}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{req.message}</p>
                <button
                  onClick={() => confirmApprove(req.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
              <h2 className="text-xl font-semibold">Confirm Approval</h2>
              <p>Are you sure you want to approve this request?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Yes, Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvolvementRequestsPage;
