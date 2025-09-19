"use client";

import { useState } from "react";

// This will later come from your database and authentication
const mockBusiness = {
  id: 1,
  name: "Cafe Java",
  description:
    "The best coffee in town, now with a generator to keep you caffeinated through load shedding.",
  hasPower: true, // This is the value we want to update
};

export default function DashboardPage() {
  // State to manage the power status
  const [hasPower, setHasPower] = useState(mockBusiness.hasPower);
  // State to show a confirmation message
  const [isSaved, setIsSaved] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the browser from refreshing
    console.log("Would save this status to the database:", hasPower);

    // Simulate saving to a database
    setIsSaved(true);
    // Hide the success message after 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        Business Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Manage your business listing.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{mockBusiness.name}</h2>
        <p className="text-gray-600 mb-6">{mockBusiness.description}</p>

        <form onSubmit={handleSubmit}>
          {/* Power Status Toggle */}
          <div className="mb-6">
            <label
              htmlFor="power-status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Power Status
            </label>
            <div className="flex items-center">
              <button
                type="button" // This is a button, not a form submitter
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Status
          </button>

          {/* Success Message */}
          {isSaved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
              Status updated successfully!
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
