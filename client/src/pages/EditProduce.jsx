// src/pages/EditProduce.jsx
// Form to edit existing produce listing

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProduceById, updateProduce } from '../services/produceService';

const EditProduce = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        produce_name: '',
        category: '',
        quantity: '',
        unit: '',
        price_per_unit: '',
        available_from: '',
        available_until: '',
        description: '',
        quality_grade: '',
        location: '',
        status: 'available'
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
    const grades = ['Premium', 'Grade A', 'Grade B', 'Standard'];
    const statuses = ['available', 'sold', 'expired'];

    useEffect(() => {
        fetchProduce();
    }, [id]);

    const fetchProduce = async () => {
        try {
            setLoading(true);
            const response = await getProduceById(id);
            const produce = response.data;

            // Format dates for input fields
            const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                produce_name: produce.produce_name || '',
                category: produce.category || '',
                quantity: produce.quantity || '',
                unit: produce.unit || '',
                price_per_unit: produce.price_per_unit || '',
                available_from: formatDate(produce.available_from),
                available_until: formatDate(produce.available_until),
                description: produce.description || '',
                quality_grade: produce.quality_grade || '',
                location: produce.location || '',
                status: produce.status || 'available'
            });
        } catch (err) {
            setError(err.message || 'Failed to load produce listing');
        } finally {
            setLoading(false);
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
        if (!formData.produce_name || !formData.quantity || !formData.location) {
            setError('Please fill in all required fields');
            return;
        }

        if (parseFloat(formData.quantity) <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }

        if (formData.price_per_unit && parseFloat(formData.price_per_unit) < 0) {
            setError('Price cannot be negative');
            return;
        }

        setSubmitting(true);

        try {
            await updateProduce(id, {
                ...formData,
                quantity: parseFloat(formData.quantity),
                price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : null
            });

            alert('Produce listing updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to update produce listing');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading produce listing...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Edit Produce Listing</h1>
                            <p className="text-gray-600 mt-2">Update your produce information</p>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Produce Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Produce Name *
                                </label>
                                <input
                                    type="text"
                                    name="produce_name"
                                    value={formData.produce_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                        min="0.01"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price and Quality Grade */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price per Unit (KES)
                                    </label>
                                    <input
                                        type="number"
                                        name="price_per_unit"
                                        value={formData.price_per_unit}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quality Grade
                                    </label>
                                    <select
                                        name="quality_grade"
                                        value={formData.quality_grade}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {grades.map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Location and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {statuses.map(status => (
                                            <option key={status} value={status} className="capitalize">
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Available From and Until */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Available From
                                    </label>
                                    <input
                                        type="date"
                                        name="available_from"
                                        value={formData.available_from}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Available Until
                                    </label>
                                    <input
                                        type="date"
                                        name="available_until"
                                        value={formData.available_until}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Describe your produce..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Updating...' : 'Update Listing'}
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

export default EditProduce;