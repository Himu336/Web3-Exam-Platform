import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useUsers } from '../../../contexts/UserContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const { getUserById, updateUser, loading: userLoading, error: userError } = useUsers();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    department: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        const userData = await getUserById(currentUser.id);
        setProfile(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          department: userData.department || '',
        });
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser?.id, getUserById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    
    try {
      const updatedProfile = await updateUser(currentUser.id, formData);
      setProfile(updatedProfile);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (loading || userLoading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  if (error || userError) {
    return <div className="bg-red-100 p-4 rounded-md text-red-600">{error || userError}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Faculty Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className="mb-4 bg-green-100 p-4 rounded-md text-green-600">
            Profile updated successfully!
          </div>
        )}

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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-2xl font-semibold text-green-700">
                {profile?.username?.charAt(0).toUpperCase() || 'F'}
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
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p className="mt-1 text-lg">{profile?.department || 'Not specified'}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1 text-lg capitalize">{profile?.role}</p>
              </div>

              <div className="border rounded-md p-4">
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