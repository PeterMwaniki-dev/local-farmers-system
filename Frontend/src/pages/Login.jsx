import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Corn Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src="/Images/corn.jpeg"
                    alt="Farming"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                {/* Text on image */}
                <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
                    <h2 className="text-4xl font-bold mb-4">Welcome to Sonnet Shamba</h2>
                    <p className="text-lg text-gray-200">
                        Smart farming solutions to help you monitor, analyze, and optimize your agricultural operations.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Back to Home */}
                    <div className="flex justify-end mb-4">
                        <Link to="/" className="text-sm text-gray-600 hover:text-gray-800 transition">
                            ← Back to Home
                        </Link>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <img
                            src="/Images/canvas.png"
                            alt="Sonnet Shamba Logo"
                            className="w-7 h-7 object-contain"
                        />
                        <span className="text-xl font-bold text-green-600">Sonnet Shamba</span>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-gray-500 text-sm">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;