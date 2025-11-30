'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Shield, Users, Star, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Real-Time Tracking",
            description: "Monitor machine availability and queue status in real-time"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Smart Queue System",
            description: "Join queues and get notified when it's your turn"
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI Recommendations",
            description: "Get weather-based wash recommendations powered by AI"
        }
    ];

    const reviews = [
        {
            name: "Sarah Johnson",
            role: "Resident",
            rating: 5,
            comment: "WashSync has made laundry day so much easier! No more waiting around wondering when a machine will be free."
        },
        {
            name: "Mike Chen",
            role: "Student",
            rating: 5,
            comment: "The queue system is brilliant. I can study while waiting and get notified when it's my turn. Game changer!"
        },
        {
            name: "Emily Davis",
            role: "Property Manager",
            rating: 5,
            comment: "Managing our laundry facilities has never been easier. The admin panel gives us complete control."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Logo/Icon */}
                    <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 fade-in">
                        Welcome to <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">WashSync</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto fade-in">
                        Smart laundry management made simple. Track machines, join queues, and never waste time waiting again.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
                        <button
                            onClick={() => router.push('/login')}
                            className="btn btn-primary text-lg px-8 py-4 shadow-2xl"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 inline ml-2" />
                        </button>
                        <button
                            onClick={() => router.push('/register')}
                            className="btn bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 text-lg px-8 py-4"
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">100%</div>
                            <div className="text-gray-300 text-sm">Efficiency</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-gray-300 text-sm">Availability</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">0</div>
                            <div className="text-gray-300 text-sm">Wait Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white/5 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Why Choose WashSync?
                        </h2>
                        <p className="text-xl text-gray-300">
                            Everything you need for hassle-free laundry management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="bg-gradient-to-r from-primary-500 to-primary-700 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-gray-300">
                            Join thousands of happy users
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className="card bg-white/10 backdrop-blur-lg border border-white/20"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 mb-6 italic">
                                    "{review.comment}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{review.name}</div>
                                        <div className="text-sm text-gray-600">{review.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join WashSync today and experience the future of laundry management
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/register')}
                            className="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-2xl"
                        >
                            Sign Up Free
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="btn bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 text-lg px-8 py-4"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 bg-black/20 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto text-center text-gray-400">
                    <p>&copy; 2024 WashSync. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
