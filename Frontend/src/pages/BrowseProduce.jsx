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

                {/* ✅ REPLACED PRODUCE GRID */}
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
                    ) : (
                        <>
                            {/* Produce Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {produce.length === 0 ? (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-gray-500 text-lg">No produce listings found</p>
                                    </div>
                                ) : (
                                    produce.map((item) => (
                                        <div
                                            key={item.listing_id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                                        >
                                            {/* Product Image */}
                                            <div className="h-48 bg-gray-200 overflow-hidden">
                                                {item.image_url ? (
                                                    <img
                                                        src={`http://localhost:5000${item.image_url}`}
                                                        alt={item.produce_name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                                                        <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">{item.produce_name}</h3>
                                                    {item.category && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <p className="text-gray-600">
                                                        <span className="font-semibold">Quantity:</span> {item.quantity} {item.unit}
                                                    </p>
                                                    {item.price_per_unit && (
                                                        <p className="text-green-600 font-bold text-lg">
                                                            KES {parseFloat(item.price_per_unit).toLocaleString()} per {item.unit}
                                                        </p>
                                                    )}
                                                    <p className="text-gray-600">
                                                        <span className="font-semibold">Location:</span> {item.location}
                                                    </p>
                                                    {item.quality_grade && (
                                                        <p className="text-gray-600">
                                                            <span className="font-semibold">Grade:</span> {item.quality_grade}
                                                        </p>
                                                    )}
                                                    <p className="text-gray-600">
                                                        <span className="font-semibold">Farmer:</span> {item.farmer_name}
                                                    </p>
                                                </div>

                                                {item.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                                )}

                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                    <span>👁 {item.views_count} views</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        item.status === 'available' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </div>

                                                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseProduce;
