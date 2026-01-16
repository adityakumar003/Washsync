'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { branchesAPI } from '@/lib/api';
import { Sparkles, Star, Eye, EyeOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, register } = useAuth();

    // Determine initial tab from URL or default to login
    const [activeTab, setActiveTab] = useState('login');
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'signup') {
            setActiveTab('signup');
        }
    }, [searchParams]);

    // Login state
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Signup state
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        branchId: ''
    });
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [branches, setBranches] = useState([]);
    const [loadingBranches, setLoadingBranches] = useState(true);

    // Common state
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await branchesAPI.getActive();
            setBranches(response.data);
        } catch (err) {
            console.error('Failed to fetch branches:', err);
            setError('Failed to load branches. Please refresh the page.');
        } finally {
            setLoadingBranches(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(loginData.email, loginData.password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!signupData.branchId) {
            setError('Please select a branch');
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (signupData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(signupData.name, signupData.email, signupData.password, signupData.branchId);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: 'url(/laundry_background.png)' }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold">WashSync</span>
                    </div>

                    {/* Hero Content */}
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight">
                            Laundry day,<br />done smarter.
                        </h1>
                        <p className="text-lg text-gray-300 max-w-md">
                            Focus on your studies, we'll handle the wash. Manage your hostel laundry effortlessly with real-time tracking and easy payments.
                        </p>
                    </div>

                    {/* Testimonial */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="ml-2 text-lg font-semibold">4.9/5</span>
                        </div>
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-800" />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-slate-800" />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-slate-800" />
                        </div>
                        <p className="text-sm text-gray-400">Trusted by 5,000+ students</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => {
                                setActiveTab('login');
                                setError('');
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all duration-200 ${activeTab === 'login'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('signup');
                                setError('');
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all duration-200 ${activeTab === 'signup'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <div className="space-y-6 fade-in">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                                <p className="mt-2 text-gray-600">Please enter your details to sign in.</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email or Student ID
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="auth-input"
                                        placeholder="Enter your email or ID"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showLoginPassword ? 'text' : 'password'}
                                            required
                                            className="auth-input pr-10"
                                            placeholder="Enter your password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                        Forgot password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In →'
                                    )}
                                </button>
                            </form>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setActiveTab('signup')}
                                        className="font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Sign up for free
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Signup Form */}
                    {activeTab === 'signup' && (
                        <div className="space-y-6 fade-in">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
                                <p className="mt-2 text-gray-600">Join WashSync to get started.</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {loadingBranches ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-gray-600 mt-2">Loading branches...</p>
                                </div>
                            ) : branches.length === 0 ? (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                                    <p className="font-semibold">No branches available</p>
                                    <p className="text-sm mt-1">Please contact the administrator to create a branch first.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSignupSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Branch
                                        </label>
                                        <select
                                            required
                                            className="auth-input"
                                            value={signupData.branchId}
                                            onChange={(e) => setSignupData({ ...signupData, branchId: e.target.value })}
                                        >
                                            <option value="">Choose your branch...</option>
                                            {branches.map((branch) => (
                                                <option key={branch._id} value={branch._id}>
                                                    {branch.name} - {branch.location}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="auth-input"
                                            placeholder="John Doe"
                                            value={signupData.name}
                                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="auth-input"
                                            placeholder="you@example.com"
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSignupPassword ? 'text' : 'password'}
                                                required
                                                className="auth-input pr-10"
                                                placeholder="••••••••"
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                className="auth-input pr-10"
                                                placeholder="••••••••"
                                                value={signupData.confirmPassword}
                                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            'Sign Up →'
                                        )}
                                    </button>
                                </form>
                            )}

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => setActiveTab('login')}
                                        className="font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
