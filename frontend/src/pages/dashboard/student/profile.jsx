import { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    rollNumber: user?.roleId || 'CS2023001',
    email: user?.email || 'john.doe@example.com',
    dateOfBirth: '2000-08-15',
    contactNumber: '+91 9876543210',
    department: 'Computer Science',
    course: 'B.Tech Computer Science & Engineering',
    semester: '6th',
    batch: '2021-2025',
    gender: 'Male',
    fatherName: 'Robert Doe',
    motherName: 'Sarah Doe',
    residenceState: 'Maharashtra',
    address: '123, Example Street, Example City - 400001'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Profile Information</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 flex items-center gap-2 bg-white text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            <span>✏️</span>
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <span>💾</span>
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Photo */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 rounded-full border-4 border-slate-200 overflow-hidden">
                <img 
                  src="https://placekitten.com/200/200"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Right Column - Details Form */}
          <div className="md:w-2/3">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <h4 className="font-semibold text-slate-800 mb-4">Personal Information</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text"
                  name="name"
                  className={`mt-1 p-2 w-full border rounded-md ${
                    isEditing ? 'bg-white border-slate-300 focus:ring-indigo-500 focus:border-indigo-500' : 'bg-slate-50 border-slate-200'
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Roll Number</label>
                <input 
                  type="text"
                  name="rollNumber"
                  className="mt-1 p-2 w-full border border-slate-200 rounded-md bg-slate-50"
                  value={formData.rollNumber}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                <input 
                  type="date"
                  name="dateOfBirth"
                  className={`mt-1 p-2 w-full border rounded-md ${isEditing ? 'bg-white' : 'bg-slate-50'}`}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Gender</label>
                <select
                  name="gender"
                  className={`mt-1 p-2 w-full border rounded-md ${isEditing ? 'bg-white' : 'bg-slate-50'}`}
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Academic Information */}
              <div className="md:col-span-2 mt-4">
                <h4 className="font-semibold text-slate-800 mb-4">Academic Information</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <input 
                  type="text"
                  name="department"
                  className="mt-1 p-2 w-full border border-slate-200 rounded-md bg-slate-50"
                  value={formData.department}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Course</label>
                <input 
                  type="text"
                  name="course"
                  className="mt-1 p-2 w-full border rounded-md bg-slate-50"
                  value={formData.course}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Current Semester</label>
                <input 
                  type="text"
                  name="semester"
                  className="mt-1 p-2 w-full border rounded-md bg-slate-50"
                  value={formData.semester}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Batch</label>
                <input 
                  type="text"
                  name="batch"
                  className="mt-1 p-2 w-full border rounded-md bg-slate-50"
                  value={formData.batch}
                  readOnly
                />
              </div>

              {/* Contact Information */}
              <div className="md:col-span-2 mt-4">
                <h4 className="font-semibold text-slate-800 mb-4">Contact Information</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email ID</label>
                <input 
                  type="email"
                  name="email"
                  className="mt-1 p-2 w-full border border-slate-200 rounded-md bg-slate-50"
                  value={formData.email}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Contact Number</label>
                <input 
                  type="tel"
                  name="contactNumber"
                  className={`mt-1 p-2 w-full border rounded-md ${isEditing ? 'bg-white' : 'bg-slate-50'}`}
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Residential Address</label>
                <textarea 
                  name="address"
                  rows="2"
                  className={`mt-1 p-2 w-full border rounded-md ${isEditing ? 'bg-white' : 'bg-slate-50'}`}
                  value={formData.address}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </form>

            {/* Password Change Section */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-4">Security</h4>
              <button 
                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <span>🔄</span>
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
