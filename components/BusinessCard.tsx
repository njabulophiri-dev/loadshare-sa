"use client";

// This defines the "shape" of the data this component expects
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
  id,
}: BusinessCardProps) {
  // Function to handle clicking the "Update Status" button (for later)
  const handleUpdateClick = () => {
    // For now, we'll just log to the console
    console.log(`Would update status for business ID: ${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Business Name and Power Status */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
        {/* Dynamic status badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            hasPower
              ? "bg-green-100 text-green-800" // Styles for YES power
              : "bg-red-100 text-red-800" // Styles for NO power
          }`}
        >
          {hasPower ? "Power ON" : "Power OFF"}
        </span>
      </div>

      {/* Business Description */}
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => console.log(`Would view details for ${name}`)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Details →
        </button>
        {/* This button will only show for business owners later */}
        <button
          onClick={handleUpdateClick}
          className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}
