"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface AreaInfo {
  id: string;
  name: string;
  region: string;
}

interface EskomStatus {
  stage: string;
  message: string;
  updatedAt: string;
}

interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  areaId: string;
  areaName: string;
  hasPower: boolean;
  powerType: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string;
    email: string;
  };
}

export default function Search() {
  const { data: session } = useSession();
  const [areas, setAreas] = useState<AreaInfo[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [eskomStatus, setEskomStatus] = useState<EskomStatus | null>(null);

  // Load Eskom areas
  useEffect(() => {
    fetch("/api/eskom/areas?q=Johannesburg")
      .then((res) => res.json())
      .then((data) => setAreas(data.areas || []));
  }, []);

  // Load Eskom status for selected area
  useEffect(() => {
    if (!selectedArea) return;
    setEskomStatus(null);

    fetch(`/api/eskom/status?areaId=${selectedArea}`)
      .then((res) => res.json())
      .then((data) => setEskomStatus(data.status || null))
      .catch(() =>
        setEskomStatus({
          stage: "Unknown",
          message: "Failed to fetch status",
          updatedAt: "",
        })
      );
  }, [selectedArea]);

  const searchBusinesses = async () => {
    if (!selectedArea) return;
    setLoading(true);
    setBusinesses([]);

    try {
      const response = await fetch(
        `/api/businesses?area=${selectedArea}&type=${searchQuery}`
      );
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error("Error searching businesses:", error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterBusiness = () => {
    if (!session) {
      signIn("google", { callbackUrl: "/search" });
      return;
    }
    setShowRegistration(true);
  };

  const submitBusinessRegistration = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!session) {
      signIn("google", { callbackUrl: "/search" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      type: formData.get("type")?.toString().trim(),
      address: formData.get("address")?.toString().trim(),
      areaId: selectedArea,
      areaName: areas.find((a) => a.id === selectedArea)?.name || "",
      powerType: formData.get("powerType")?.toString().trim(),
    };

    try {
      const res = await fetch("/api/businesses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error || "Registration failed"}`);
        return;
      }

      const data = await res.json();
      alert(`Business "${data.business.name}" registered successfully!`);
      setShowRegistration(false);
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Find Businesses</h1>
        <p className="text-gray-600 mb-6">
          Search for real businesses in your area and check Eskom load shedding
          status.
        </p>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Area
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">Choose an area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Business Type
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="restaurant">Restaurants</option>
                <option value="coffee">Coffee Shops</option>
                <option value="coworking">Co-working Spaces</option>
                <option value="mall">Shopping Malls</option>
                <option value="gym">Gyms</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={searchBusinesses}
                disabled={loading || !selectedArea}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Find Businesses"}
              </button>
            </div>
          </div>
        </div>

        {/* Eskom Status */}
        {selectedArea && eskomStatus && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800">
            <h3 className="font-semibold text-lg mb-1">
              Eskom Load Shedding Status: Stage {eskomStatus.stage}
            </h3>
            <p>{eskomStatus.message}</p>
            {eskomStatus.updatedAt && (
              <p className="text-sm text-orange-700 mt-1">
                Last updated: {new Date(eskomStatus.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Business Results */}
        {businesses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white shadow rounded-lg p-4">
                <h4 className="font-semibold text-lg">{business.name}</h4>
                <p className="text-gray-600">{business.type}</p>
                <p className="text-gray-600">{business.address}</p>
                <p className="text-sm text-gray-500">
                  Backup Power:{" "}
                  {business.hasPower ? business.powerType : "None"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          selectedArea && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-700 mb-4">
                No businesses found for this area yet.
              </p>
            </div>
          )
        )}

        {/* Call to Action for Businesses */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            Are you a business owner?
          </h3>
          <p className="text-blue-700 mb-4">
            List your business and reach customers during load shedding. Show
            when you have backup power available.
          </p>
          <button
            onClick={handleRegisterBusiness}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Register Your Business
          </button>
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                Register Your Business
              </h3>
              <form onSubmit={submitBusinessRegistration}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter your business name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Business Type
                    </label>
                    <select
                      name="type"
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="coffee">Coffee Shop</option>
                      <option value="coworking">Co-working Space</option>
                      <option value="retail">Retail Store</option>
                      <option value="gym">Gym/Fitness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Business address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Backup Power Type
                    </label>
                    <select
                      name="powerType"
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select power type</option>
                      <option value="generator">Generator</option>
                      <option value="ups">UPS/Inverter</option>
                      <option value="solar">Solar + Battery</option>
                      <option value="none">No Backup Power</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRegistration(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
