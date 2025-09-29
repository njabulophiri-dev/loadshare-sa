"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  owner: { name: string; email: string };
}

export default function AdminPanel() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/businesses/verify");
      const data = await res.json();
      if (res.ok) setBusinesses(data.businesses || []);
      else toast.error(data.error || "Failed to fetch");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/admin/businesses/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: id, action }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Business ${action}d`);
        fetchBusinesses();
      } else toast.error(data.error || "Action failed");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Admin Verification Panel</h1>
      {businesses.length === 0 && <p>No businesses to verify</p>}
      <div className="space-y-4">
        {businesses.map((b) => (
          <div
            key={b.id}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{b.name}</h3>
              <p>
                {b.type} | {b.address}
              </p>
              <p className="text-sm text-gray-500">
                Owner: {b.owner.name} ({b.owner.email})
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAction(b.id, "approve")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(b.id, "reject")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
