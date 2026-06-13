import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { getMyProfile, updateProfile } from '../services/userService';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { darkMode } = useSettings();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    location: '',
    // Farmer fields
    farm_size: '',
    farm_location: '',
    main_crops: '',
    farming_experience: '',
    // Expert fields
    specialization: '',
    qualification: '',
    years_of_experience: '',
    organization: '',
    // Buyer fields
    business_name: '',
    business_type: '',
    preferred_produce: '',
    delivery_location: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        location: data.location || '',
        // Farmer fields
        farm_size: data.farmer_profile?.farm_size || '',
        farm_location: data.farmer_profile?.farm_location || '',
        main_crops: data.farmer_profile?.main_crops || '',
        farming_experience: data.farmer_profile?.farming_experience || '',
        // Expert fields
        specialization: data.expert_profile?.specialization || '',
        qualification: data.expert_profile?.qualification || '',
        years_of_experience: data.expert_profile?.years_of_experience || '',
        organization: data.expert_profile?.organization || '',
        // Buyer fields
        business_name: data.buyer_profile?.business_name || '',
        business_type: data.buyer_profile?.business_type || '',
        preferred_produce: data.buyer_profile?.preferred_produce || '',
        delivery_location: data.buyer_profile?.delivery_location || ''
      });

      setLoadingData(false);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.full_name || !formData.email || !formData.phone_number) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const updatedData = await updateProfile(formData);
      
      // Update user context
      if (updateUser) {
        updateUser(updatedData);
      }

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Edit Profile</h1>
              <p className={darkMode ? 'text-gray-300 mt-2' : 'text-gray-600 mt-2'}>Update your personal information</p>
            </div>

            {error && (
              <div className={`${darkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'} px-4 py-3 rounded mb-6`}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className={`text-xl font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., Kiambu"
                    />
                  </div>
                </div>
              </div>

              {/* Farmer-specific fields */}
              {user?.user_type === 'farmer' && (
                <div>
                  <h2 className={`text-xl font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
                    Farm Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Farm Size */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Farm Size (acres)
                      </label>
                      <input
                        type="number"
                        name="farm_size"
                        value={formData.farm_size}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>

                    {/* Farm Location */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Farm Location
                      </label>
                      <input
                        type="text"
                        name="farm_location"
                        value={formData.farm_location}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Kiambu County"
                      />
                    </div>

                    {/* Main Crops */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Main Crops
                      </label>
                      <input
                        type="text"
                        name="main_crops"
                        value={formData.main_crops}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Maize, Beans, Tomatoes"
                      />
                    </div>

                    {/* Farming Experience */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Farming Experience (years)
                      </label>
                      <input
                        type="number"
                        name="farming_experience"
                        value={formData.farming_experience}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Expert-specific fields */}
              {user?.user_type === 'expert' && (
                <div>
                  <h2 className={`text-xl font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
                    Expert Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialization */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Crop Science"
                      />
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., PhD Agricultural Sciences"
                      />
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Kenya Agricultural Research Institute"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer-specific fields */}
              {user?.user_type === 'buyer' && (
                <div>
                  <h2 className={`text-xl font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
                    Business Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Fresh Harvest Ltd"
                      />
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Business Type
                      </label>
                      <input
                        type="text"
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Wholesaler, Retailer, Restaurant"
                      />
                    </div>

                    {/* Preferred Produce */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Preferred Produce
                      </label>
                      <input
                        type="text"
                        name="preferred_produce"
                        value={formData.preferred_produce}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Vegetables, Fruits"
                      />
                    </div>

                    {/* Delivery Location */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Delivery Location
                      </label>
                      <input
                        type="text"
                        name="delivery_location"
                        value={formData.delivery_location}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Nairobi CBD"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;