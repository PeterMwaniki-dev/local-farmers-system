// src/pages/FarmerDashboard.jsx
// Farmer's main dashboard

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyListings, deleteProduce } from '../services/produceService';
import { useAuth } from '../contexts/AuthContext';

const FarmerDashboard = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyListings();
    }, []);

    const fetchMyListings = async () => {
        try {
            setLoading(true);
            const response = await getMyListings();
            setListings(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, produceName) => {
        if (!window.confirm(`Are you sure you want to delete "${produceName}"?`)) {
            return;
        }

        try {
            await deleteProduce(id);
            setListings(listings.filter(item => item.listing_id !== id));
            alert('Produce deleted successfully!');
        } catch (err) {
            alert(err.message || 'Failed to delete produce');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome back, {user?.full_name}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Manage your produce listings and connect with buyers.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Listings</p>
                                <p className="text-3xl font-bold text-green-600">{listings.length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Available</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {listings.filter(l => l.status === 'available').length}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Views</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {listings.reduce((sum, l) => sum + (l.views_count || 0), 0)}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Listings Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">My Produce Listings</h2>
                        <Link
                            to="/produce/create"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            + Add New Produce
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading your listings...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 mb-4">You haven't created any produce listings yet.</p>
                            <Link
                                to="/produce/create"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Create Your First Listing
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((produce) => (
                                <div key={produce.listing_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800">{produce.produce_name}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            produce.status === 'available' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {produce.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p><span className="font-medium">Category:</span> {produce.category}</p>
                                        <p><span className="font-medium">Quantity:</span> {produce.quantity} {produce.unit}</p>
                                        <p><span className="font-medium">Price:</span> KES {produce.price_per_unit}/{produce.unit}</p>
                                        <p><span className="font-medium">Location:</span> {produce.location}</p>
                                        <p><span className="font-medium">Views:</span> {produce.views_count || 0}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/produce/edit/${produce.listing_id}`}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(produce.listing_id, produce.produce_name)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;