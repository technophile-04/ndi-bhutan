"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface ProofData {
  requested_presentation?: {
    revealed_attrs?: {
      [key: string]: Array<{ value: string }>;
    };
  };
}

export default function VerifyPage() {
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [proofData, setProofData] = useState<ProofData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch QR code URL
  useEffect(() => {
    fetch("/api/proof")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setProofUrl(data.url);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to generate verification request");
        setLoading(false);
      });
  }, []);

  // Poll for proof result
  useEffect(() => {
    if (!proofUrl) return;

    const interval = setInterval(() => {
      fetch("/api/webhook")
        .then(res => res.json())
        .then(data => {
          if (data.proof) {
            setProofData(data.proof);
            clearInterval(interval);
          }
        })
        .catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, [proofUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Setting up verification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error">
            <div>
              <h3 className="font-bold">Verification Setup Failed</h3>
              <div className="text-xs">{error}</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="btn btn-primary">
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Identity Verification</h1>
          <p className="text-lg text-base-content/70">
            Scan the QR code below with your Bhutan NDI wallet app to verify your identity
          </p>
        </div>

        {!proofData && proofUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* QR Code Section */}
            <div className="text-center">
              <div className="bg-base-100 p-8 rounded-2xl shadow-lg">
                <div className="mb-4">
                  <QRCodeSVG value={proofUrl} size={280} className="mx-auto" />
                </div>
                <div className="text-sm text-base-content/60 mb-4">QR Code for Bhutan NDI Wallet</div>
                <div className="loading loading-dots loading-md"></div>
                <p className="text-sm mt-2">Waiting for verification...</p>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-6">
              <div className="bg-base-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">📱 Step 1: Open NDI Wallet</h3>
                <p className="text-base-content/70">Launch the official Bhutan NDI wallet app on your mobile device.</p>
              </div>

              <div className="bg-base-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">📷 Step 2: Scan QR Code</h3>
                <p className="text-base-content/70">
                  Use the scan feature in your wallet app to scan the QR code displayed on the left.
                </p>
              </div>

              <div className="bg-base-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">✅ Step 3: Approve Sharing</h3>
                <p className="text-base-content/70">
                  Review the verification request and approve sharing your ID Number and Full Name.
                </p>
              </div>

              <div className="alert alert-info">
                <div>
                  <h4 className="font-bold">What information will be shared?</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Your Full Name</li>
                    <li>• Your National ID Number</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {proofData && (
          <div className="text-center">
            <div className="bg-success/20 border border-success rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-success mb-6">Verification Successful!</h2>

              <div className="space-y-4 text-left bg-base-100 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Full Name:</span>
                  <span className="text-right">
                    {proofData.requested_presentation?.revealed_attrs?.["Full Name"]?.[0]?.value || "N/A"}
                  </span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">ID Number:</span>
                  <span className="text-right">
                    {proofData.requested_presentation?.revealed_attrs?.["ID Number"]?.[0]?.value || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-x-4">
                <Link href="/dashboard" className="btn btn-primary">
                  View Dashboard
                </Link>
                <Link href="/" className="btn btn-ghost">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* URL Display */}
        {proofUrl && !proofData && (
          <div className="mt-8">
            <div className="collapse collapse-arrow bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium">Show verification URL (for manual sharing)</div>
              <div className="collapse-content">
                <div className="bg-base-200 p-4 rounded text-xs break-all">{proofUrl}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
