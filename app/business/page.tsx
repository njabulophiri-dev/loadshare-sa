import Link from "next/link";

export default function BusinessPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        For Business Owners
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Turn load shedding into an opportunity. Get discovered by customers when
        they need you most.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Value Proposition 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Attract Customers</h2>
          <p className="text-gray-600 mb-4">
            Update your real-time power status and appear in search results for
            users looking for a place with power.
          </p>
        </div>

        {/* Value Proposition 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Recover Lost Revenue</h2>
          <p className="text-gray-600 mb-4">
            Mitigate the impact of load shedding by promoting your business
            during off-peak hours.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Go to Business Dashboard
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          (This is a demo. Future versions will require login.)
        </p>
      </div>
    </main>
  );
}
