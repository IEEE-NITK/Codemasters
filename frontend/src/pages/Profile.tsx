import React, { useState, useEffect } from 'react';
import { UserCircle, LogOut, Mail, Briefcase } from 'lucide-react';

interface UserData {
    username: string;
    email: string;
    role: string;
    Rating: string;
}

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = localStorage.getItem('token');
        if (!id) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch(`http://localhost:3000/user/userData/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout');
      if (response.ok) {
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback data for preview purposes
  const user = userData || {
    username: "janedoe",
    email: "jane.doe@example.com",
    role: "Senior Developer"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm transition duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Main profile card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Cover image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          {/* Profile info */}
          <div className="relative px-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20">
              <div className="flex justify-center sm:justify-start">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <UserCircle size={80} className="text-gray-400" />
                </div>
              </div>
              <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-600">{user.role}</p>
              </div>
            </div>
          </div>

          {/* User details */}
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" size={20} />
                <span className="text-gray-700">{user.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="text-gray-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-gray-900">Current Role</h3>
                  <p className="text-gray-700">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Activity section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Projects</h4>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Teams</h4>
                  <p className="text-3xl font-bold text-blue-600">4</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Contributions</h4>
                  <p className="text-3xl font-bold text-blue-600">238</p>
                </div>
              </div>
            </div>

            {/* Account section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 border border-gray-300 rounded-md shadow-sm transition duration-300 text-center">
                  Change Password
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 border border-gray-300 rounded-md shadow-sm transition duration-300 text-center">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;