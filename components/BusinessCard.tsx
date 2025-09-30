"use client";

interface BusinessCardProps {
  name: string;
  description: string;
  hasPower: boolean;
  id: number;
}

export default function BusinessCard({
  name,
  description,
  hasPower,
}: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Business Name and Power Status */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
        {/* Dynamic status badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            hasPower ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {hasPower ? "Power ON" : "Power OFF"}
        </span>
      </div>

      {/* Business Description */}
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Action Buttons - REMOVED UPDATE BUTTON */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => console.log(`Would view details for ${name}`)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
