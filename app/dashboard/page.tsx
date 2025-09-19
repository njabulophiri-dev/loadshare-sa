"use client";

import { useState, useEffect } from "react";

interface Business {
  id: number;
  name: string;
  description: string;
  hasPower: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [hasPower, setHasPower] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch business data on component mount
  useEffect(() => {
    async function fetchBusiness() {
      try {
        // Using business ID 1 (Cafe Java from seed data)
        const response = await fetch("/api/businesses/1");
        if (!response.ok) {
          throw new Error(`Failed to fetch business data: ${response.status}`);
        }
        const data = await response.json();
        setBusiness(data);
        setHasPower(data.hasPower);
      } catch (error) {
        console.error("Failed to fetch business:", error);
        alert("Failed to load business data. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch("/api/businesses/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hasPower }),
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const updatedBusiness = await response.json();
      console.log("Status updated successfully:", updatedBusiness);

      // Update local state with the new data
      setBusiness(updatedBusiness);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        `Failed to update status: ${error.message}. Check console for details.`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <div className="text-center">Loading business data...</div>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <div className="text-center text-red-600">
          Business not found or failed to load
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        Business Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Manage your business listing.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{business.name}</h2>
        <p className="text-gray-600 mb-6">{business.description}</p>

        <form onSubmit={handleSubmit}>
          {/* Power Status Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Power Status
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  hasPower ? "bg-green-500" : "bg-gray-400"
                }`}
                onClick={() => setHasPower(!hasPower)}
                aria-pressed={hasPower}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    hasPower ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="ml-3 text-sm">
                <span className="font-medium text-gray-900">
                  Power is {hasPower ? "ON" : "OFF"}
                </span>
              </span>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>

          {/* Success Message */}
          {isSaved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
              ✅ Status updated successfully!
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
