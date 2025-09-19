import BusinessCard from "../../components/BusinessCard"; // Import the new component

// Create some fake data for demonstration
const fakeBusinesses = [
  {
    id: 1,
    name: "Cafe Java",
    description:
      "The best coffee in town, now with a generator to keep you caffeinated through load shedding.",
    hasPower: true,
  },
  {
    id: 2,
    name: "The Office Hub",
    description:
      "A quiet co-working space with high-speed fibre and plenty of sockets. Perfect for remote workers.",
    hasPower: true,
  },
  {
    id: 3,
    name: "Gino's Pizzeria",
    description:
      "Authentic Italian pizza. Unfortunately, our oven is off during load shedding.",
    hasPower: false,
  },
];

export default function SearchPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-2">Find a Spot</h1>
      <p className="text-center text-gray-600 mb-8">
        Discover businesses with power near you.
      </p>

      {/* Search Bar - We'll make this work later */}
      <div className="max-w-2xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {fakeBusinesses.map((business) => (
          <BusinessCard
            key={business.id} // A unique key is required for each item in a list
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
