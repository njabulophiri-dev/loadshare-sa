"use client";

import BusinessCard from "../../components/BusinessCard";
import { useState, useMemo, useEffect } from "react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch businesses from API on component mount
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const response = await fetch("/api/businesses");
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    if (!searchQuery) return businesses;

    const query = searchQuery.toLowerCase();
    return businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query)
    );
  }, [searchQuery, businesses]);

  if (isLoading) {
    return (
      <main className="min-h-screen p-8">
        <div className="text-center">Loading businesses...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-2">Find a Spot</h1>
      <p className="text-center text-gray-600 mb-8">
        Discover businesses with power near you.
      </p>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            name={business.name}
            description={business.description}
            hasPower={business.hasPower}
            id={business.id}
          />
        ))}
      </div>
    </main>
  );
}
