// src/pages/BrowseProduce.jsx
// Public page to browse all available produce

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProduce, getCategories } from '../services/produceService';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const BrowseProduce = () => {
    const { isAuthenticated } = useAuth();
    const [produce, setProduce] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter states
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        location: '',
        min_price: '',
        max_price: ''
    });

    useEffect(() => {
        fetchCategories();
        fetchProduce();
    }, []);

    useEffect(() => {
        fetchProduce();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const fetchProduce = async () => {
        try {
            setLoading(true);
            const response = await getAllProduce(filters);
            setProduce(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load produce');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            search: '',
            location: '',
            min_price: '',
            max_price: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {isAuthenticated ? (
                <Navbar />
            ) : (
                <nav className="bg-green-600 text-white shadow-lg">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center py-4">
                            <Link to="/" className="text-2xl font-bold hover:text-green-100">
                                🌾 Local Farmers
                            </Link>
                            <div className="space-x-4">
                                <Link to="/login" className="hover:text-green-100 transition">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Fresh Produce</h1>
                    <p className="text-gray-600">
                        Discover quality produce from local farmers in your area
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Produce</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search produce..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                placeholder="e.g., Kiambu"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Min Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Price (KES)
                            </label>
                            <input
                                type="number"
                                name="min_price"
                                value={filters.min_price}
                                onChange={handleFilterChange}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Max Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price (KES)
                            </label>
                            <input
                                type="number"
                                name="max_price"
                                value={filters.max_price}
                                onChange={handleFilterChange}
                                placeholder="1000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={clearFilters}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Produce Grid */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading produce...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : produce.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600 mb-2">No produce found matching your filters.</p>
                            <button
                                onClick={clearFilters}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Clear filters to see all produce
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold">{produce.length}</span> produce listings
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {produce.map((item) => (
                                    <div
                                        key={item.listing_id}
                                        className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-white"
                                    >
                                        {/* Header */}
                                        <div className="mb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {item.produce_name}
                                                </h3>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                                    {item.category}
                                                </span>
                                            </div>
                                            {item.quality_grade && (
                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    {item.quality_grade}
                                                </span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Quantity:</span>
                                                <span className="font-semibold text-gray-800">
                                                    {item.quantity} {item.unit}
                                                </span>
                                            </div>
                                            
                                            {item.price_per_unit && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Price:</span>
                                                    <span className="font-semibold text-green-600">
                                                        KES {item.price_per_unit}/{item.unit}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Location:</span>
                                                <span className="font-semibold text-gray-800">
                                                    {item.location}
                                                </span>
                                            </div>

                                            {item.description && (
                                                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Farmer Info */}
                                        <div className="border-t pt-3 mt-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs">Farmer</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {item.farmer_name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-500 text-xs">Contact</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {item.farmer_phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseProduce;