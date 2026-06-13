import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getMyRequests, deleteRequest } from '../services/buyerService';
import { getUnreadCount } from '../services/messageService';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const BuyerDashboard = () => {
    const { user } = useAuth();
    const { darkMode } = useSettings();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        fetchMyRequests();
        fetchUnreadMessages();
    }, []);

    const fetchUnreadMessages = async () => {
        try {
            const response = await getUnreadCount();
            setUnreadMessages(response.data?.count || 0);
        } catch {
            setUnreadMessages(0);
        }
    };

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const response = await getMyRequests();
            setRequests(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, produceName) => {
        if (!window.confirm(`Are you sure you want to delete the request for "${produceName}"?`)) {
            return;
        }

        try {
            await deleteRequest(id);
            setRequests(requests.filter(item => item.request_id !== id));
            alert('Request deleted successfully!');
        } catch (err) {
            alert(err.message || 'Failed to delete request');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'fulfilled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
                    <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Welcome back, {user?.full_name}! 👋
                    </h1>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manage your produce requests and connect with farmers.
                    </p>
                </div>

                {unreadMessages > 0 && (
                    <Link
                        to="/messages"
                        className="block bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8 hover:bg-indigo-100 transition dark:bg-gray-800 dark:border-gray-700"
                    >
                        <p className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                            You have {unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''}
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Click here to view your conversations</p>
                    </Link>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Requests</p>
                                <p className="text-3xl font-bold text-blue-600">{requests.length}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Open Requests</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {requests.filter(r => r.status === 'open').length}
                                </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fulfilled</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {requests.filter(r => r.status === 'fulfilled').length}
                                </p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Requests Section */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>My Produce Requests</h2>
                        <Link
                            to="/requests/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            + New Request
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading your requests...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>You haven't created any requests yet.</p>
                            <Link
                                to="/requests/create"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Create Your First Request
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map((request) => (
                                <div key={request.request_id} className={`border rounded-lg p-4 hover:shadow-lg transition ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{request.produce_needed}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm mb-4">
                                        {request.category && (
                                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><span className="font-medium">Category:</span> {request.category}</p>
                                        )}
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><span className="font-medium">Quantity:</span> {request.quantity_needed} {request.unit}</p>
                                        {request.budget_per_unit && (
                                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><span className="font-medium">Budget:</span> KES {request.budget_per_unit}/{request.unit}</p>
                                        )}
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><span className="font-medium">Delivery:</span> {request.delivery_location}</p>
                                        {request.needed_by_date && (
                                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><span className="font-medium">Needed by:</span> {new Date(request.needed_by_date).toLocaleDateString()}</p>
                                        )}
                                        {request.description && (
                                            <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">{request.description}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/requests/edit/${request.request_id}`}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(request.request_id, request.produce_needed)}
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
        </Layout>
    );
};

export default BuyerDashboard;
