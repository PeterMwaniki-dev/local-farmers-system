import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createRequest } from '../services/buyerService';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    produce_needed: '',
    category: 'Vegetables',
    quantity_needed: '',
    unit: 'kg',
    budget_per_unit: '',
    delivery_location: '',
    needed_by_date: '',
    description: ''
  });

  const categories = [
    'Vegetables',
    'Fruits',
    'Cereals',
    'Legumes',
    'Tubers',
    'Dairy',
    'Poultry',
    'Other'
  ];

  const units = ['kg', 'bags', 'crates', 'pieces', 'liters'];

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
    if (!formData.produce_needed || !formData.quantity_needed || !formData.delivery_location) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.quantity_needed) <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (formData.budget_per_unit && parseFloat(formData.budget_per_unit) < 0) {
      setError('Budget cannot be negative');
      return;
    }

    setLoading(true);

    try {
      await createRequest({
        ...formData,
        quantity_needed: parseFloat(formData.quantity_needed),
        budget_per_unit: formData.budget_per_unit ? parseFloat(formData.budget_per_unit) : null
      });

      alert('Request created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Create Produce Request</h1>
              <p className="text-gray-600 mt-2">Post what produce you need and connect with farmers</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Produce Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produce Needed *
                </label>
                <input
                  type="text"
                  name="produce_needed"
                  value={formData.produce_needed}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Needed *
                  </label>
                  <input
                    type="number"
                    name="quantity_needed"
                    value={formData.quantity_needed}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget per Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget per Unit (KES)
                </label>
                <input
                  type="number"
                  name="budget_per_unit"
                  value={formData.budget_per_unit}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 75"
                />
                <p className="text-sm text-gray-500 mt-1">Optional: Your maximum budget per unit</p>
              </div>

              {/* Delivery Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Location *
                </label>
                <input
                  type="text"
                  name="delivery_location"
                  value={formData.delivery_location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Nairobi CBD"
                />
              </div>

              {/* Needed By Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Needed By Date
                </label>
                <input
                  type="date"
                  name="needed_by_date"
                  value={formData.needed_by_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Optional: When you need this produce</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your requirements (quality, packaging, delivery preferences...)"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Request'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;