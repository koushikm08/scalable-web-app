import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/user/profile', formData);
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Profile Settings
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="card">
          {/* Profile Header */}
          <div className="flex items-center mb-8 pb-8 border-b-2 border-gray-100">
            <div className="avatar w-24 h-24 text-4xl shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-lg text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold border border-green-300">
                  ✓ Active Account
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div className={`rounded-xl p-4 border-2 ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
              }`}>
                <p className={`text-base font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="input text-base"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input bg-gray-100 text-base cursor-not-allowed"
                value={user?.email}
                disabled
              />
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                Email cannot be changed for security reasons
              </p>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                rows="5"
                className="input text-base"
                placeholder="Tell us about yourself, your role, and interests..."
                value={formData.bio}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                Maximum 500 characters ({formData.bio.length}/500)
              </p>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                className="input text-base"
                placeholder="https://example.com/your-avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                Provide a URL to your profile picture
              </p>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary text-base px-8 py-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>

          {/* Account Information */}
          <div className="mt-10 pt-8 border-t-2 border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="text-sm font-semibold text-gray-600 mb-1">Member Since</div>
                <div className="text-lg font-bold text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                <div className="text-sm font-semibold text-gray-600 mb-1">User ID</div>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {user?.id}
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-10 pt-8 border-t-2 border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Security</h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border-2 border-gray-300">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;