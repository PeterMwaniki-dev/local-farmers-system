// src/pages/ProduceDetails.jsx
// Single produce item details page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduceById } from '../services/produceService';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const ProduceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [produce, setProduce] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProduceDetails();
    }, [id]);

    const fetchProduceDetails = async () => {
        try {
            setLoading(true);
            const response = await getProduceById(id);
            setProduce(response.data);
        } catch (err) {
            setError('Failed to load produce details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !produce) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error || 'Produce not found'}
                    </div>
                    <button
                        onClick={() => navigate('/produce')}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        ← Back to Browse Produce
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/produce')}
                    className="mb-6 text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Browse Produce
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        <div>
                            {produce.image_url ? (
                                <img
                                    src={`http://localhost:5000${produce.image_url}`}
                                    alt={produce.produce_name}
                                    className="w-full h-96 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                    <svg className="w-32 h-32 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{produce.views_count}</p>
                                    <p className="text-xs text-gray-600">Views</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{produce.quantity}</p>
                                    <p className="text-xs text-gray-600">{produce.unit} Available</p>
                                </div>
                                <div className={`p-3 rounded-lg ${
                                    produce.status === 'available' ? 'bg-green-100' :
                                    produce.status === 'sold' ? 'bg-blue-100' : 'bg-red-100'
                                }`}>
                                    <p className={`text-sm font-bold ${
                                        produce.status === 'available' ? 'text-green-800' :
                                        produce.status === 'sold' ? 'text-blue-800' : 'text-red-800'
                                    }`}>
                                        {produce.status.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                {produce.category && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                        {produce.category}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl font-bold text-gray-800 mb-4">{produce.produce_name}</h1>

                            <div className="mb-6">
                                <p className="text-3xl font-bold text-green-600">
                                    KES {parseFloat(produce.price_per_unit).toLocaleString()}
                                </p>
                                <p className="text-gray-600">per {produce.unit}</p>
                            </div>

                            {produce.description && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{produce.description}</p>
                                </div>
                            )}

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-700"><strong>Location:</strong> {produce.location}</span>
                                </div>

                                {produce.quality_grade && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-700"><strong>Quality Grade:</strong> {produce.quality_grade}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <span className="text-gray-700">
                                        <strong>Listed:</strong> {new Date(produce.created_at).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Farmer Information</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <strong>Name:</strong> {produce.farmer_name}
                                    </p>
                                    {isAuthenticated ? (
                                        <>
                                            <p><strong>Phone:</strong> {produce.farmer_phone}</p>
                                            <p><strong>Email:</strong> {produce.farmer_email}</p>
                                        </>
                                    ) : (
                                        <Link to="/login">Login to view contact info</Link>
                                    )}
                                </div>
                            </div>

                            {isAuthenticated ? (
                                <div className="flex gap-4">
                                    <a
                                        href={`tel:${produce.farmer_phone}`}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg text-center"
                                    >
                                        📞 Call Farmer
                                    </a>

                                    <a
                                        href={`mailto:${produce.farmer_email}`}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-center"
                                    >
                                        ✉️ Email Farmer
                                    </a>
                                </div>
                            ) : (
                                <Link to="/register">Register to Contact Farmer</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProduceDetails;