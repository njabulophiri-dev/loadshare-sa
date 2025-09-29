"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface AreaStatus {
  area: string;
  currentStage?: number;
  updated?: string;
}

export default function Home() {
  const [status, setStatus] = useState<AreaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/eskom/status?areaId=eskde-4-sandton-sandton")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LoadShare <span className="text-blue-600">SA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real load shedding data. Real businesses with backup power.
          </p>

          {/* Current Load Shedding Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-3">
              Live Load Shedding Status
            </h2>
            {loading ? (
              <div className="text-gray-500">Loading real-time data...</div>
            ) : status ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Stage:</span>
                  <span
                    className={`font-bold ${
                      (status.currentStage || 0) > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {status.currentStage
                      ? `Stage ${status.currentStage}`
                      : "No Load Shedding"}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Area:</span>
                  <span>{status.area}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Real-time data unavailable</div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Find Businesses
            </Link>
            <Link
              href="/auth/signin"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Business Login
            </Link>
          </div>

          {/* Real Data Promise */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Load Shedding Solutions in Your Area
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  ✅ Real Load Shedding Data
                </h3>
                <p className="text-sm text-gray-600">
                  Live Eskom sePush API integration
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  ✅ Real Business Listings
                </h3>
                <p className="text-sm text-gray-600">
                  Verified businesses with backup power
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">✅ Live Power Status</h3>
                <p className="text-sm text-gray-600">
                  Real-time updates from businesses
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">✅ Customer Verified</h3>
                <p className="text-sm text-gray-600">
                  Real reviews and ratings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
