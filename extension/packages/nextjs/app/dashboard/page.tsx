"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VerificationRecord {
  id: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  fullName?: string;
  idNumber?: string;
  threadId?: string;
}

export default function DashboardPage() {
  const [currentProof, setCurrentProof] = useState<any>(null);
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current proof status
    fetch("/api/webhook")
      .then(res => res.json())
      .then(data => {
        setCurrentProof(data.proof);

        // Simulate verification history (in a real app, this would come from a database)
        if (data.proof) {
          const newRecord: VerificationRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            status: "completed",
            fullName: data.proof.requested_presentation?.revealed_attrs?.["Full Name"]?.[0]?.value,
            idNumber: data.proof.requested_presentation?.revealed_attrs?.["ID Number"]?.[0]?.value,
            threadId: data.proof.thread_id,
          };

          // Get existing history from localStorage
          const existingHistory = JSON.parse(localStorage.getItem("verificationHistory") || "[]");

          // Check if this verification already exists
          const exists = existingHistory.some(
            (record: VerificationRecord) =>
              record.fullName === newRecord.fullName && record.idNumber === newRecord.idNumber,
          );

          if (!exists) {
            const updatedHistory = [newRecord, ...existingHistory].slice(0, 10); // Keep last 10
            localStorage.setItem("verificationHistory", JSON.stringify(updatedHistory));
            setVerificationHistory(updatedHistory);
          } else {
            setVerificationHistory(existingHistory);
          }
        } else {
          // Load existing history
          const existingHistory = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
          setVerificationHistory(existingHistory);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("verificationHistory");
    setVerificationHistory([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "failed":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Verification Dashboard</h1>
            <p className="text-lg text-base-content/70">Monitor your identity verification status and history</p>
          </div>
          <Link href="/verify" className="btn btn-primary">
            New Verification
          </Link>
        </div>

        {/* Current Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  Current Verification Status
                  {currentProof && <div className="badge badge-success">Active</div>}
                </h2>

                {currentProof ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-success/10 rounded-lg">
                      <div>
                        <div className="font-semibold">
                          {currentProof.requested_presentation?.revealed_attrs?.["Full Name"]?.[0]?.value || "N/A"}
                        </div>
                        <div className="text-sm text-base-content/70">
                          ID: {currentProof.requested_presentation?.revealed_attrs?.["ID Number"]?.[0]?.value || "N/A"}
                        </div>
                      </div>
                      <div className="badge badge-success">Verified</div>
                    </div>

                    <div className="text-xs text-base-content/60">
                      Last verified: {formatTimestamp(new Date().toISOString())}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-base-content/70 mb-4">No active verification found</p>
                    <Link href="/verify" className="btn btn-outline btn-sm">
                      Start Verification
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Statistics</h3>
              <div className="space-y-4">
                <div className="stat">
                  <div className="stat-title text-sm">Total Verifications</div>
                  <div className="stat-value text-2xl">{verificationHistory.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-sm">Success Rate</div>
                  <div className="stat-value text-2xl">{verificationHistory.length > 0 ? "100%" : "0%"}</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-sm">Last Verification</div>
                  <div className="stat-desc">
                    {verificationHistory.length > 0
                      ? formatTimestamp(verificationHistory[0].timestamp).split(",")[0]
                      : "Never"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification History */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Verification History</h3>
              {verificationHistory.length > 0 && (
                <button onClick={clearHistory} className="btn btn-ghost btn-sm text-error">
                  Clear History
                </button>
              )}
            </div>

            {verificationHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Full Name</th>
                      <th>ID Number</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificationHistory.map(record => (
                      <tr key={record.id}>
                        <td>
                          <div className="text-sm">{formatTimestamp(record.timestamp)}</div>
                        </td>
                        <td>
                          <div className="font-medium">{record.fullName || "N/A"}</div>
                        </td>
                        <td>
                          <div className="font-mono text-sm">{record.idNumber || "N/A"}</div>
                        </td>
                        <td>
                          <div className={`badge ${getStatusColor(record.status)}`}>{record.status}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-base-content/70 mb-4">No verification history found</p>
                <p className="text-sm text-base-content/50">Complete your first verification to see it here</p>
              </div>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">NDI Service:</span> Bhutan National Digital Identity
                </div>
                <div>
                  <span className="font-semibold">Environment:</span> Staging
                </div>
                <div>
                  <span className="font-semibold">Schema:</span> Foundational ID
                </div>
                <div>
                  <span className="font-semibold">Verification Method:</span> QR Code Scan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
