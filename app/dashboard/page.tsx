'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoadSheddingStatus {
  area: string;
  currentStage?: number;
  nextStage?: number;
  updated?: string;
  schedule: Array<{
    day: string;
    stages: Array<{
      stage: number;
      times: string[];
    }>;
  }>;
}

interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  area: string;
  hasPower: boolean;
  powerType: string;
  capacity: string;
  description: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadShedding, setLoadShedding] = useState<LoadSheddingStatus | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    area: '',
    powerType: '',
    capacity: 'Medium',
    description: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Load load shedding data
    fetch('/api/eskom/status?areaId=eskde-4-sandton-sandton')
      .then(res => res.json())
      .then(data => {
        setLoadShedding(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load user's businesses if they're a business owner
    if (session.user?.role === 'BUSINESS_OWNER') {
      loadUserBusinesses();
    }
  }, [session, status, router]);

  const loadUserBusinesses = async () => {
    setBusinessLoading(true);
    try {
      const response = await fetch('/api/businesses?owner=true');
      const data = await response.json();
      setUserBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setBusinessLoading(false);
    }
  };

  const handleRegisterBusiness = () => {
    setShowRegistration(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitBusinessRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      const response = await fetch('/api/businesses/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Business registered successfully! It will be visible after verification.');
        setShowRegistration(false);
        setFormData({
          name: '',
          type: '',
          address: '',
          area: '',
          powerType: '',
          capacity: 'Medium',
          description: ''
        });
        // Refresh the business list
        loadUserBusinesses();
      } else {
        alert(result.error || 'Failed to register business');
      }
    } catch (error) {
      alert('Failed to register business. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}! 👋</h1>
          <p className="text-gray-600">
            {session.user?.role === 'BUSINESS_OWNER' 
              ? 'Manage your businesses and view load shedding information' 
              : 'View load shedding information for your area'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Load Shedding Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Load Shedding Status</h2>
            
            {loading ? (
              <div className="text-gray-500">Loading status...</div>
            ) : loadShedding ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Stage:</span>
                  <span className={`text-lg font-bold ${
                    (loadShedding.currentStage || 0) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {loadShedding.currentStage ? `Stage ${loadShedding.currentStage}` : 'No Load Shedding'}
                  </span>
                </div>
                
                {loadShedding.nextStage && (
                  <div className="flex justify-between">
                    <span>Next Stage:</span>
                    <span className="font-medium">Stage {loadShedding.nextStage}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Area:</span>
                  <span>{loadShedding.area}</span>
                </div>
                
                {loadShedding.updated && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Updated:</span>
                    <span>{new Date(loadShedding.updated).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">Status unavailable</div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/search')}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🔍 Find Businesses With Power
              </button>
              <button 
                onClick={() => router.push('/search')}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                📊 View Full Schedule
              </button>
              <button 
                onClick={handleRegisterBusiness}
                className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                🏢 Register Your Business
              </button>
            </div>
          </div>
        </div>

        {/* User's Businesses */}
        {session.user?.role === 'BUSINESS_OWNER' && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Businesses</h2>
              <span className="text-sm text-gray-500">
                {userBusinesses.length} business{userBusinesses.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {businessLoading ? (
              <div className="text-gray-500">Loading your businesses...</div>
            ) : userBusinesses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userBusinesses.map(business => (
                  <div key={business.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{business.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        business.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {business.verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize mb-1">{business.type}</p>
                    <p className="text-sm text-gray-500 mb-2">{business.address}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Power: {business.hasPower ? '✅ Available' : '❌ None'}</span>
                      <span>Updated: {new Date(business.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't registered any businesses yet.</p>
                <button 
                  onClick={handleRegisterBusiness}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Register your first business
                </button>
              </div>
            )}
          </div>
        )}

        {/* Today's Schedule */}
        {loadShedding && loadShedding.schedule.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Load Shedding Schedule</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {loadShedding.schedule[0]?.stages.map((stageInfo) => (
                <div key={stageInfo.stage} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-center">Stage {stageInfo.stage}</h3>
                  <div className="space-y-1 text-sm">
                    {stageInfo.times.map((time, index) => (
                      <div key={index} className="text-gray-600 text-center">{time}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Register Your Business</h3>
              <form onSubmit={submitBusinessRegistration}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter your business name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Type *</label>
                    <select 
                      name="type"
                      className="w-full p-2 border rounded-lg" 
                      value={formData.type}
                      onChange={handleFormChange}
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
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <input 
                      type="text" 
                      name="address"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Full business address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Area/Suburb *</label>
                    <input 
                      type="text" 
                      name="area"
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., Sandton, Pretoria Central"
                      value={formData.area}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Backup Power Type</label>
                    <select 
                      name="powerType"
                      className="w-full p-2 border rounded-lg" 
                      value={formData.powerType}
                      onChange={handleFormChange}
                    >
                      <option value="">No Backup Power</option>
                      <option value="generator">Generator</option>
                      <option value="ups">UPS/Inverter</option>
                      <option value="solar">Solar + Battery</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacity</label>
                    <select 
                      name="capacity"
                      className="w-full p-2 border rounded-lg" 
                      value={formData.capacity}
                      onChange={handleFormChange}
                    >
                      <option value="Small">Small (Single room/area)</option>
                      <option value="Medium">Medium (Multiple areas)</option>
                      <option value="Large">Large (Entire premises)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      name="description"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Describe your business and power setup"
                      rows={3}
                      value={formData.description}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRegistration(false)}
                    disabled={registerLoading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {registerLoading ? 'Registering...' : 'Register Business'}
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
