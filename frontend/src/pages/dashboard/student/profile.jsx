import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const Profile = () => {
  const { currentUser, getProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    rollNumber: '',
    program: '',
    semester: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          rollNumber: response.data.rollNumber || '',
          program: response.data.program || '',
          semester: response.data.semester || ''
        });
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This would typically call an API to update the profile
    // For now, we'll just simulate a successful update
    setProfile({
      ...profile,
      ...formData
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded-md text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Student Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                id="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                Program
              </label>
              <input
                type="text"
                name="program"
                id="program"
                value={formData.program}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <input
                type="text"
                name="semester"
                id="semester"
                value={formData.semester}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-700">
                {profile?.username?.charAt(0).toUpperCase() || 'S'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-lg">{profile?.username}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{profile?.email}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Roll Number</h3>
                <p className="mt-1 text-lg">{profile?.rollNumber || 'Not specified'}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Program</h3>
                <p className="mt-1 text-lg">{profile?.program || 'Not specified'}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Semester</h3>
                <p className="mt-1 text-lg">{profile?.semester || 'Not specified'}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1 text-lg capitalize">{profile?.role}</p>
              </div>

              <div className="border rounded-md p-4 md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1 text-lg">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
