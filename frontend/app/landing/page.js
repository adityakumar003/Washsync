'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Shield, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-Time Tracking",
            description: "Monitor machine availability and queue status in real-time with instant updates"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Smart Queue System",
            description: "Join queues efficiently and get notified when it's your turn to use a machine"
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "AI Recommendations",
            description: "Get weather-based wash recommendations powered by advanced AI technology"
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
        <div className="min-h-screen bg-white">
            {/* Hero Section - Dark Slate Background */}
            <section className="relative bg-gradient-to-br from-slate-dark to-slate-medium min-h-screen flex items-center justify-center px-4">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Logo/Icon */}
                    <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-blue-primary rounded-xl">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 fade-in">
                        Professional Laundry Management
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto fade-in">
                        Smart laundry management made simple. Track machines, join queues, and never waste time waiting again.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in mb-16">
                        <button
                            onClick={() => router.push('/login')}
                            className="btn btn-primary text-lg px-8 py-4"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 inline ml-2" />
                        </button>
                        <button
                            onClick={() => router.push('/register')}
                            className="btn bg-white text-slate-dark hover:bg-gray-100 text-lg px-8 py-4"
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center border-r border-gray-600 last:border-r-0">
                            <div className="text-4xl font-bold text-white mb-2">100%</div>
                            <div className="text-gray-400 text-sm">Efficiency</div>
                        </div>
                        <div className="text-center border-r border-gray-600 last:border-r-0">
                            <div className="text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-gray-400 text-sm">Availability</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">0</div>
                            <div className="text-gray-400 text-sm">Wait Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - White Background */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-dark mb-4">
                            Why Choose WashSync?
                        </h2>
                        <p className="text-xl text-slate-text">
                            Everything you need for hassle-free laundry management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card hover:shadow-lg transition-all duration-300"
                            >
                                <div className="bg-blue-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-dark mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-text leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section - Light Gray Background */}
            <section className="py-20 px-4 bg-gray-light">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-dark mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-slate-text">
                            Join thousands of happy users
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className="card bg-white border-l-4 border-blue-primary"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-slate-medium mb-6 leading-relaxed">
                                    "{review.comment}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-border">
                                    <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center text-white font-bold text-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-dark">{review.name}</div>
                                        <div className="text-sm text-slate-text">{review.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section - Blue Background */}
            <section className="py-20 px-4 bg-blue-primary">
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
                            className="btn bg-white text-blue-primary hover:bg-gray-100 text-lg px-8 py-4 shadow-lg"
                        >
                            Sign Up Free
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="btn bg-blue-hover text-white hover:bg-slate-dark text-lg px-8 py-4"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 bg-slate-dark">
                <div className="max-w-6xl mx-auto text-center text-gray-400">
                    <p>&copy; 2024 WashSync. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
